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
var turndownService = new TurndownService()


var localPath = 'DocFx/_site/api/'
inputFilePath = localPath.concat(iD[1][1])
//?console.log(inputFilePath);
var  htmlContent= fs.readFileSync(inputFilePath, 'utf8');

//?var htmlContent ='<h1>sampleHTML:)!</h1>'
// converts HTML text to MD
var markdownContent = turndownService.turndown(htmlContent);
//var markdown = 'Class FrameworkConstants  ';

var outputFilePath = iD[1][1];
outputFilePath = outputFilePath.replace('.html', '.md');
outputFilePath ='Documentation/'.concat(outputFilePath);
fs.writeFile(outputFilePath, markdownContent, function (err) {
  if (err) return console.log(err);
});


//Writing titles and sub-titles of Wiki-sidebar to the -Sidebar.md
//Writing titles and sub-titles of Wiki-sidebar to the -Sidebar.md
var outputTitle = '';
for(i=0;i<iD[0].length; i++)
{
	var outputTitle0 = '';
	var outputTitle1 = '';
	
	if(iD[0][i] == 'expand-stub')
	{
		//Main title
		outputTitle0 = iD[1][i];
		outputTitle0 = outputTitle0.replace('.html', '');
		outputTitle1 = '* ['.concat(outputTitle0, '](https://github.com/KiaTam/TestWiki/wiki/');
		//outputTitle0 = outputTitle0.concat('](https://github.com/adriantanasa/github-wiki-sidebar/wiki/');
		outputTitle1 = outputTitle1.concat(outputTitle0, ')');
	}else //if(iD[0][i] == 'nav level2')
	{
		//Subtitle title
		outputTitle0 = iD[1][i];
		outputTitle0 = outputTitle0.replace('.html', '');
		outputTitle1 = '  * ['.concat(outputTitle0, '](https://github.com/KiaTam/TestWiki/wiki/Usage%3A-');
		//outputTitle0 = outputTitle0.concat('](https://github.com/adriantanasa/github-wiki-sidebar/wiki/Usage%3A-');
		outputTitle1 = outputTitle1.concat(outputTitle0, ')');
	}
	
	outputTitle = outputTitle.concat(outputTitle1,'\r\n')
	
}

//var outputFilePath ='Documentation/sample.md';
fs.writeFile('DocFx/_Sidebar.md', outputTitle, function (err) {
  if (err) return console.log(err);
});
