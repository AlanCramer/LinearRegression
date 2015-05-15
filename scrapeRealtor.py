import urllib2
from urllib2 import Request, urlopen, URLError
import re

def findThingId (resp):
	id = -1
	m = re.search('thing-dl-filename.*STL', resp)

	if m:
		subres = m.group()
		subm = re.search('download:.*\"', subres)
		
		if subm:
			id = subm.group()
			id = re.sub('download:', '' ,id)
			
			id = re.sub('\"', '', id)
		
	return id

def openSite(url, resp):
	try:
		req = Request(url)
		resp = urllib2.urlopen(req)
	except URLError as e:
		if hasattr(e, 'reason'):
			print 'We failed to reach a server.'
			print 'Reason: ', e.reason
		elif hasattr(e, 'code'):
			print 'The server couldn\'t fulfill the request.'
			print 'Error code: ', e.code
		
	
site = 	"http://www.realtor.com/soldhomeprices/Lynnfield_MA";

try:
    req = Request(site)
    response = urllib2.urlopen(req)
except URLError as e:
    if hasattr(e, 'reason'):
        print 'We failed to reach a server.'
        print 'Reason: ', e.reason
    elif hasattr(e, 'code'):
        print 'The server couldn\'t fulfill the request.'
        print 'Error code: ', e.code

resp = response.read();
#print resp
searchObj = re.search(r'listing-price', resp, re.M|re.I);
print searchObj

