# -*- coding: utf-8 -*-
"""
Created on Wed Feb  7 12:37:47 2018

@author: jingyu
"""

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.webdriver.common.keys import Keys

import os
import pandas as pd
import numpy as np



############################ 
###### this is new update
############################ 

def get_api_information():    
    org_l=[]
    service_l=[]
    explain_l=[]
    #service_category_l=[]
    
    for i in range(1,20):    
        try:            
            org=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[6]/table/tbody/tr['+str(i)+']/td[1]').text
            service=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[6]/table/tbody/tr['+str(i)+']/td[2]').text
            explain=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[6]/table/tbody/tr['+str(i)+']/td[3]').text
            #service_category=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[2]/div[2]/dl/dt').text
            
            org_l.append(org)
            service_l.append(service)
            explain_l.append(explain)
            #service_category_l.append(service_category)
        except:
            break 
    return org_l,service_l,explain_l

# get information in one page
def get_information():
    # title, category, breif explanation, purpose
    title=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[2]/div[2]/p').text
    service_category=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[2]/div[2]/dl/dt').text
    
    explain=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[3]').text
    purpose=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[4]').text
    
    
    # additional information
    #addinfo=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]').text    
    service_start=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]/table/tbody/tr[1]/td[1]').text
    category=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]/table/tbody/tr[1]/td[2]').text
    dev=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]/table/tbody/tr[2]/td[1]').text
    dev_loc=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]/table/tbody/tr[2]/td[2]').text
    dev_category=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]/table/tbody/tr[3]/td[1]').text
    regis_day=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div[5]/table/tbody/tr[3]/td[2]').text

    # using API
    org,service,explain=get_api_information()
    
    df=pd.DataFrame({"title":[title],"service_category":[service_category], "explain":[explain],"purpose":[purpose],
                 'service_start':[service_start],'category':[category],'dev':[dev],
                 'dev_loc':[dev_loc],'dev_category':[dev_category],'regis_day':[regis_day],
                 'org':[org],'service':[service],'explain':[explain]})

    return df


#
def page_iter_one():
    all_info=pd.DataFrame()
    try:
        for i in range(1,10):
            elem=driver.find_elements_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/form/div[5]/ul/li['+str(i)+']/div[2]/p/a')
            elem[0].click()        
            # get info
            all_info=all_info.append(get_information())        
            # go back
            driver.execute_script("window.history.go(-1)")
    except:
        pass
    print('one page iteration is done')
    return all_info    


# 
def multi_page_iter(k):
    multi_page_info=pd.DataFrame()
    
    for i in range(k):        
        for j in range(3,13):
            multi_page_info=multi_page_info.append(page_iter_one())
            # 1~10 page -- j = 3~12 
            next_button=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/div/a['+str(j)+']')
            next_button.click()
    
    print('scraping is done')
    return multi_page_info


def main():

    os.chdir('D:/myworks/18-1/sna')
    # crawling with chrome 
    driver=webdriver.Chrome()
    
    # go 
    driver.get('https://www.data.go.kr/useCase/exam/index.do')
    
    number_of_instance=driver.find_element_by_xpath('//*[@id="sub-main"]/div[3]/div[2]/form/div[3]/p/span').text
    page_number=round(int(number_of_instance)/9)    
    print('the number of page is :', page_number)    
        
    
    done=multi_page_iter(18)
    
    df=done.reset_index(drop=True)
    pd.DataFrame.to_csv(df,'new_sna_project.csv')
    
    driver.quit()


if __name__ == '__main__':
	main()
