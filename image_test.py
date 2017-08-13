import urllib2
data = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
        'Accept-Encoding': 'none',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive'}

req = urllib2.Request(
    url='http://www.gujaratsamachar.com/index.php/pdf_download/zipfilechk/1/28', headers=data)

response = urllib2.urlopen(req)
value = response.read()
print value + '/x'


from PIL import Image


def merge(meged_iamge, args*):
    """Summary

    Args:
        meged_iamge (TYPE): Description
    """
    card = Image.new("RGBA", (600, 982), (255, 255, 255))
    img1 = Image.open("/home/prasenjit/Desktop/2.png").convert("RGBA")
    img2 = Image.open("/home/prasenjit/Desktop/1.jpg").convert("RGBA")
    x, y = img2.size
    card.paste(img2, (0, 0, x, y), img2)
    x, y = img1.size
    card.paste(img1, (0, 0, x, y), img1)
    card.save("/home/prasenjit/Desktop/test.png", format="png")

