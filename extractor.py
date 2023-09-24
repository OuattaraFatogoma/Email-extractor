import re
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
import time

Search = "site:instagram.com \"70k followers\" \"@gmail.com\" 100...50000 Posts"
s = Service("C:/Users/HUAWEI/Documents/Web-scrapping/crhomeDriver/chromedriver.exe")
driver = webdriver.Chrome(service=s)

driver.get("https://www.google.com/")
time.sleep(5)
searchIn = driver.find_element("xpath", "/html/body/div[1]/div[3]/form/div[1]/div[1]/div[1]/div/div[2]/textarea")
searchIn.send_keys(Search)
time.sleep(1)
searchIn.send_keys(Keys.ENTER)

mails = []

time.sleep(60)
for i in range(1, 50):
    try:
        r = driver.page_source
        soup = BeautifulSoup(r, "lxml")
        texts = soup.find_all("div")

        for text in texts:
            x = re.findall("[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+", text.text)
            mails += x

        driver.find_element("xpath", "/html/body/div[6]/div/div[12]/div/div[4]/div/div[3]/table/tbody/tr/td[12]/a/span[2]").click()
        print(i)
        #print(driver.current_url)
        time.sleep(6)
    except:
        print("Error detected")
        break

print(mails)
print(len(mails))

emails = set(mails)
rafinner = emails.union(emails)

mails = list(rafinner)
print(mails)
print(len(mails))

df = pd.DataFrame({"Emails": mails})
df.to_excel("70K.xlsx")
time.sleep(60)