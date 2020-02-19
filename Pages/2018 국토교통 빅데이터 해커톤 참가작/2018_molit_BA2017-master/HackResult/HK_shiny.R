############################################################################################################
############################################################################################################
######Project : 국토 교통 해커톤
######TEAM : BA2017
######Purpose : Build shiny app
############################################################################################################
############################################################################################################

#################################################
###Load environment
#################################################

pkg = c('shiny','dplyr','data.table','igraph','networkD3','tm','reticulate',"visNetwork", "colorspace")
sapply(pkg,require,character.only = T)

#setwd
setwd('C:/Users/JunmoNam/Desktop/HK')


#activate python
use_python('C:/Users/JunmoNam/Anaconda3')

#get python source for association rule
source_python('apriori.py')
source_python('word2vec.py')

#edge data
df = fread('network_for_r.csv',encoding = 'UTF-8')[,-1]
names(df) =unlist(df[1,])
df = df[-1,]
df$start =df$start %>%gsub('_'," ",.)%>% removePunctuation() %>% removeNumbers()
df$end = df$end %>%gsub('_'," ",.)%>% removePunctuation() %>% removeNumbers()

#service info data
df2 = fread('sna_project.csv',encoding = 'UTF-8')[,-1]
names(df2) = df2[1,] %>% unlist
df2 = df2[-1,]

#data info data(2)
df3 = fread('api.csv') 
names(df3)[3] = 'id'


#################################################
###Build edge weight 
#################################################

weight = table(df$start,df$end) %>% as.data.frame
names(weight) = c('start','end','weight')
weight.df = merge(df[,1:2],weight,by = c('start','end'))
df$weight = weight.df$weight


#################################################
###Build network graph with whole data
#################################################

get_start = function(x){
  return(table(x$start, x$start_org) %>% data.frame() %>%
    filter(Freq > 0) %>% mutate(Var1 = as.character(Var1), Var2 = as.character(Var2)))
}
get_end = function(x){
  return(table(x$end, x$end_org) %>% data.frame() %>%
    filter(Freq > 0) %>% mutate(Var1 = as.character(Var1), Var2 = as.character(Var2)))
}
get_nodes = function(start,end){
  return(start %>% bind_rows(end) %>% 
    rename(id = Var1, org = Var2) %>% select(id, org) %>% unique() %>%
    arrange(org))
}

# Make Edges & Nodes
start_nodes = get_start(df)
end_nodes = get_end(df)
nodes =  get_nodes(start_nodes,end_nodes)



node.exp = left_join(nodes,df3[which(unique(df3$id) %in% nodes$id),c(3,1)],by = 'id') %>% 
   group_by(id) %>% filter(row_number(id)==1)



edges <- df %>% select(start, end) %>% rename(from = start, to = end)
degree = graph_from_data_frame(df[,1:2],directed = F) %>% degree()
degree = data.frame(id = names(degree),degree = degree)

# Allocate color by org
nodes$color.background <- rainbow_hcl(length(levels(factor(nodes$org))))[factor(nodes$org)]
nodes$title = paste0("데이터명 : ",nodes$id,"<br/>",
                     '출처 : ',nodes$org,"<br/>",
                     '같이 사용된 데이터 수 : ',degree[match(nodes$id,degree$id),'degree'],
                     ifelse(is.na(node.exp$explain)|node.exp$explain=="",'',paste0("<br/>",
                                                              '데이터 설명 : ',node.exp$explain)))
nodes$color.border <- "black"
nodes$color.highlight.background <- "orange"
nodes$color.highlight.border <- "darkred"
edges$width = 1+df$weight/8
edges$color = 'grey'


# Draw circle plot
wg = visNetwork(nodes, edges, width='100%',height='950px') %>%
  visOptions(highlightNearest = TRUE,
             selectedBy = "org") %>%
  visInteraction(navigationButtons = TRUE,dragNodes = TRUE, 
                 dragView = TRUE, zoomView = TRUE) %>%
  visLegend() %>%
  visIgraphLayout(layout = "layout_with_mds", physics = FALSE,
                  smooth = FALSE, type = "square", randomSeed = NULL,
                  layoutMatrix = NULL)





#################################################
###Build Shiny UI
#################################################

ui = fluidPage(
  
  #Define main title
  titlePanel(img(src = 'logo3.png',height = 80),'엣.지.있게'),
  
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      selectInput('cat','서비스 카테고리 :',choices = unique(df$service_category),
                  selected = unique(df$service_category)[1]),
                  actionButton('dographbutton','카테고리별 그래프 그리기'),br(),br(),
                  uiOutput('select_org')
                  ),
    #Main panel of sidebar layout
    mainPanel(
      
      # Output: Tabset w/ plot, summary, and table ----
      tabsetPanel(type = "tabs",
                  tabPanel('전체 네트워크',br(),
                           fluidRow(
                             column(6, align="center", offset = 3,
                                    actionButton('update','UPDATE'),
         tags$style(type='text/css', "#button { vertical-align- middle; height- 50px; width- 100%; font-size- 30px;}")
                                    )),
                           br(),
                           visNetworkOutput('wg',height = '600px')
                            ),
                  tabPanel("카테고리별 네트워크",
                           h2('서비스 카테고리 별 네트워크'),
                           br(),br(),
                           visNetworkOutput('catgraph',height = '500px'),br(),
                           h2(textOutput('catname')),br(),
                           DT::dataTableOutput('recommend')
                            ),
                  tabPanel("API 데이터 정보",h2('API 데이터 추천'),br(),
                           textAreaInput('service_question','무슨 서비스를 하고 싶으신가요?',
                                         width = 600,height = 160),
                             actionButton("dow2v", "답변 해주기", icon = icon("comments")),br(),br(),
                           DT::dataTableOutput('w2vres')
                            )
                             
                           
                  
      )
    )
    
  )
)




#################################################
###Build Shiny Server
#################################################


server = function(input,output){
  
  #build primitive dataframe based on category
  dprime = reactive({
    df[which(df$service_category == input$cat),]  
    
  })
  
  #update organization selection
  output$select_org = renderUI({
    checkboxGroupInput('org','제공 기관 :', choices = c('All',dprime() %>% select(start_org,end_org)%>%
                                                 unlist%>% unique),selected = 'All')
  })
  
  
  #make desired dataframe(start,edge with organization sorted)
  d = eventReactive(input$dographbutton,{
      if(TRUE %in% (input$org == 'All')){
        df[which(df$service_category == input$cat),]
        
      }
      else{
        df[which(df$service_category == input$cat),] %>% 
          filter(start_org %in%  input$org |
                   end_org %in% input$org)  
          
        
      }
    })
  
  #build visnetwork
  output$catgraph = renderVisNetwork({
    
    # Make Edges & Nodes
    start_nodes = get_start(d())
    end_nodes = get_end(d())
    nodes =  get_nodes(start_nodes,end_nodes)
    
    edges <- d() %>% select(start, end) %>% rename(from = start, to = end)
    
    
    node.exp = left_join(nodes,df3[which(unique(df3$id) %in% nodes$id),c(3,1)],by = 'id') %>% 
      group_by(id) %>% filter(row_number(id)==1)
    
    degree = graph_from_data_frame(d(),directed = F) %>% degree()
    degree = data.frame(id = names(degree),degree = degree)
    
    
    # Allocate informations on network
    nodes$color.background <- rainbow_hcl(length(levels(factor(nodes$org))))[factor(nodes$org)]
    nodes$title = paste0("데이터명 : ",nodes$id,"<br/>",
                         '출처 : ',nodes$org,"<br/>",
                         '같이 사용된 데이터 수 : ',degree[match(nodes$id,degree$id),'degree'],
                         ifelse(is.na(node.exp$explain)|node.exp$explain=="",'',paste0("<br/>",
                                                                  '데이터 설명 : ',node.exp$explain)))
    
    nodes$color.border <- "black"
    nodes$color.highlight.background <- "orange"
    nodes$color.highlight.border <- "darkred"
    edges$width = 1+d()$weight/8
    edges$color = 'grey'
    # Draw circle plot
    return(
      visNetwork(nodes, edges, width='100%',height='950px') %>%
      visOptions(highlightNearest = TRUE,
                 selectedBy = "org",autoResize = TRUE) %>%
      visInteraction(navigationButtons = TRUE,dragNodes = TRUE, 
                     dragView = TRUE, zoomView = TRUE) %>%
      visLegend() %>%
      visIgraphLayout(layout = "layout_with_mds", physics = FALSE,
                      smooth = FALSE, type = "square", randomSeed = NULL,
                      layoutMatrix = NULL)
    )
    
    
    
  })
  
  
  
  #build whole network graph
  output$wg = renderVisNetwork(wg)
  
  #get catname
  
  output$catname = renderText(paste0(input$cat,' 연관 데이터 테이블'))
  
  #build whole network graph
  ap_df = reactive({
    apriori_results(input$cat)
  })
  
  output$recommend =  DT::renderDataTable(DT::datatable({
    data = sapply(ap_df(),function(x){gsub("\'","",x)}) %>% as.data.frame
  }))
  
  w2vd = eventReactive(input$dow2v,{
    w2v(input$service_question)
  })
  
  output$w2vres = DT::renderDataTable(DT::datatable({
    exp = node.exp[which(node.exp$id %in% w2vd()[,1]),]
    exp[is.na(exp)] = ""
    exp$explain = ifelse(nchar(exp$explain)>25,paste0(substr(exp$explain,1,25),'...'),
                         exp$explain)
    dt = w2vd()
    names(dt)[c(1,ncol(data))] = c('id','이 데이터는 이래요')
    dt= left_join(dt,exp,by = 'id')
    names(dt) = c('이 데이터를 추천해 드려요!','이 데이터는 요정도 추천해 드려요!','제공 기관','데이터 설명은 이래요')
    data = dt
  }))
  
}



#################################################
###Run Shiny App
#################################################



shinyApp(ui,server)

