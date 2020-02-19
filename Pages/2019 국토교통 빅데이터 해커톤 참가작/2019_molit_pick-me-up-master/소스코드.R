library(readxl)
library(tidyverse)
library(data.table)
##########################################################################################
a=read_csv("C:/Users/hyunggwang/Downloads/국토해커톤/한국감정원 제공 데이터/1. 공동주택 매매1.txt",col_names=T)

a2=a%>%select(시도,시군구,계약월,계약년도,전용면적,거래금액)

a3=a2[nchar(a2$거래금액)>6,]
a3$거래금액=as.numeric(a3$거래금액)

a5=a3%>%group_by(시도,시군구,계약년도,계약월)%>%summarise(a=mean(전용면적,na.rm=T),b=mean(거래금액,na.rm = T))%>%mutate(c=b/a)

a6=c()
p=0
for(i in unique(a5$시도)){
  for(j in unique(a5[a5$시도==i,]$시군구)){ 
    for(k in 1:35){
      z=data.table(시도=i,시군구=j,계약년도=a5[k+1,]$계약년도,계약월=a5[k+1,]$계약월,값=(a5[a5$시도==i&a5$시군구==j,][k+1,]$c/a5[a5$시도==i&a5$시군구==j,][k,]$c-1)*100)  
      a6=rbind(a6,z)
      p=p+1
      print(p)
      
    }
  }
}
#######################################################################################


#######################################################################################
install.packages("sas7bdat")
library(sas7bdat)

final=read.csv("fi.csv")
final2=final[,5:20]

pca=prcomp(final2,center = T,scale=T)
screeplot(pca,type="lines")


f1=principal(final2,rotate = "none",scores  = T)
plot(f1$values)
f2=principal(final2,nfactors = 5,rotate = "oblimin",scores  = T)

km=kmeans(f2$scores,4)

km$cluster
km$centers

a2=data.table(도시=final$시군구,군집=km$cluster)
a2=a2%>%arrange(군집)
########################################################################################

