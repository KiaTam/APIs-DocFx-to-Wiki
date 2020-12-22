const fs=require('fs');
const cheerio = require('cheerio');//Used for crawling in HTML files

//Load toc.html to be analysed by Cheerio
var inputFilePath ='DocFx/_site/api/toc.html';
var tocData = fs.readFileSync(inputFilePath, 'utf8');
const $ = cheerio.load(tocData);

// Crawling in toc.HTML: Read and sort name of HTML files in unsorted list of toc.html
const iD = [[],[]];
$("li").each(function(i,element){
		
	iD[0][i] = $(element)
	.find('span')
	.attr('class');
	
	
	iD[1][i] = $(element)
	.find('a')
	.attr('href');	
});
	

// print out the result	
	for (i=0; i<iD[0].length;i++){
		if(iD[0][i] == 'nav level2')
			console.log(iD[1][i]);	
	}

//Turndown converts HTML fille format text to Markdown
var TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')

var gfm = turndownPluginGfm.gfm
var turndownService = new TurndownService()
turndownService.use(gfm)

//var turndownService = new TurndownService()


var localPath = 'DocFx/_site/api/'
for(i=0;i<iD[1].length; i++)
{
   inputFilePath = localPath.concat(iD[1][i])
   //?console.log(inputFilePath);
   var  htmlContent= fs.readFileSync(inputFilePath, 'utf8');

   //?var htmlContent ='<h1>sampleHTML:)!</h1>'
   // converts HTML text to MD
   var markdownContent = turndownService.turndown(htmlContent);
   //var markdown = 'Class FrameworkConstants  ';

   var outputFilePath = iD[1][i];
   outputFilePath = outputFilePath.replace('.html', '.md');
   outputFilePath ='DocFx/'.concat(outputFilePath);
   fs.writeFile(outputFilePath, markdownContent, function (err) {
      if (err) return console.log(err);
   });
}

//Writing titles and sub-titles of Wiki-sidebar to the -Sidebar.md
//Writing titles and sub-titles of Wiki-sidebar to the -Sidebar.md
var outputTitle = '';
for(i=0;i<iD[0].length; i++)
{
	var outputTitle0 = '';
	var outputTitle1 = '';
	var outputTitleMain = '';

	
	if(iD[0][i] == 'expand-stub')
	{
		//Main title
		outputTitle0 = iD[1][i];
		outputTitle0 = outputTitle0.replace('.html', '');
		outputTitleMain = '* ['.concat(outputTitle0, '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		outputTitleMain = outputTitleMain.concat(outputTitle0, ')');
	}else //if(iD[0][i] == 'nav level2')
	{
		//Subtitle title
		outputTitle0 = iD[1][i];
		outputTitle0 = outputTitle0.replace('.html', '');
		outputTitle0 = outputTitle0.replace(outputTitleMain, '');

		outputTitle1 = '  * ['.concat(outputTitle0, '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		outputTitle1 = outputTitle1.concat(outputTitle0, ')');
	}
	
	outputTitle = outputTitle.concat(outputTitle1,'\r\n')
	
}

//var outputFilePath ='Documentation/sample.md';
fs.writeFile('DocFx/_Sidebar.md', outputTitle, function (err) {
  if (err) return console.log(err);
});
