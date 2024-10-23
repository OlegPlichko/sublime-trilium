#!/usr/bin/env python3
#~/Library/Appcliation Support/Sublime Text/Packages/User/SendToTrilium.py
import sublime
import sublime_plugin
from urllib.error import HTTPError, URLError
from urllib.request import urlopen, Request
from urllib import parse


TRILIUM_URL = 'http://192.168.1.X:8800' # PUT TRILIUM URL HERE

class SendToTrilium(sublime_plugin.TextCommand):
	def dump(obj):
		for attr in dir(obj):
			print("obj.%s = %r" % (attr, getattr(obj, attr)))

	def run(self, edit):
		content = self.view.substr(sublime.Region(0, self.view.size()))
		#!important to add new line in trilium note
		title = content.partition('\n')[0]
		#content = content.replace('\n', '%0A').replace('	', '&emsp;').replace(' ', '&ensp;')
		
		url = f'{TRILIUM_URL}/custom/sublimetext'
		data = {
			'secret': 'portfolio-burger-grand',
			'title': title,
			'content': content
		}
		data = parse.urlencode(data).encode()
		
		request = Request(url, data=data)
		try:
			with urlopen(request, timeout=10) as response:
				print(response.status)
				return response.read(), response
		except HTTPError as error:
			print(error.status, error.reason)
		except URLError as error:
			print(error.reason)
		except TimeoutError:
			print("Request timed out")
