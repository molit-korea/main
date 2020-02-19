import gzip
with gzip.open('D:/DTG/0801/1/part-r-00001.gz', 'rb') as f:
    file_content = f.readline()
    print(file_content)