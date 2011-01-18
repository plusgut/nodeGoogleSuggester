#!/usr/bin/env node

/*
googleSuggester-LICENCE:

Copyright 2011 Carlo Jeske. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/


var http	= require( "http" );

// Configs:
var debug	= true;
var stack	= new Array();
stack[ 0 ]	= process.argv[ 2 ];

crawlIt( stack , "");

function crawlIt( stack , prefix )
{
	stack.forEach(function (val, index, array)
	{
		var crawler  = http.createClient( 80 , "google.com" );

		var crawlerRequest = crawler.request(	"GET", 
							"http://google.com/complete/search?q=" +val, 
							{'host': 'www.google.com'});
		crawlerRequest.end();

		crawlerRequest.addListener( "response" , function (crawlerResponse)
		{
			crawlerResponse.addListener( "data" , function( chunk )
			{
				var responseContent	= chunk.toString( "utf8", 0, chunk.length );
				var data		= responseContent.split( "(" );
				if( data[ 1 ] != undefined )
				{
					data			= data[ 1 ].split( ")" );
					data			= data[ 0 ];
					var dataArray		= data.split( "],[" );
	
					var searchResult	= new Array();

					for( var suggestionData in dataArray )
					{
						if( suggestionData != 0 )
						{
							var suggestion	= dataArray[ suggestionData ].split( '","' );
							var search	= suggestion[ 0 ].replace( '"', "");
							searchResult.push( search );
							console.log( prefix + search );
						}
					}
					crawlIt( searchResult, prefix + "\t");
				}
			});
			crawlerResponse.addListener( "end" , function() 
			{
				//	response.end();
			});
		});
	});
}
