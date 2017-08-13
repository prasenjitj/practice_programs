#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import time
import urllib2


class NewsSpider:

    """docstring for NewsSpider."""

    # name = 'gujaratsamachar'

    # start_urls = ['http://www.gujaratsamachar.com/index.php/page/pdfview/1']

    def post_request(self):
        data = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                'Accept-Encoding': 'none',
                'Accept-Language': 'en-US,en;q=0.8',
                'Connection': 'keep-alive'}
        req = urllib2.Request(
        url='http://www.gujaratsamachar.com/index.php/pdf_download/zipfilechk/1/28', headers=data)
        res = urllib2.urlopen(req)
        print res.read()


def main():
    value = NewsSpider().post_request()
if __name__ == '__main__':
    main()
