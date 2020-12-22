const fs=require('fs');
const cheerio = require('cheerio');//Used for crawling in HTML files

// Load toc.html to be analysed (crawled) by Cheerio
var inputFilePath ='DocFx/_site/api/toc.html';
var tocData = fs.readFileSync(inputFilePath, 'utf8');
const $ = cheerio.load(tocData);

// Crawling in the loaded data from toc.HTML: Read and sort name of HTML files
const iD = [[],[]];
$("li").each(function(i,element){
		
	iD[0][i] = $(element)
	.find('span')
	.attr('class');
	
	
	iD[1][i] = $(element)
	.find('a')
	.attr('href');	
});
	
// Turndown converts HTML fille format text to Markdown
var TurndownService = require('turndown')

// turndown-plugin-gfm is a Turndown plugin which adds GitHub Flavored Markdown extensions.
var turndownPluginGfm = require('turndown-plugin-gfm')

var gfm = turndownPluginGfm.gfm
var turndownService = new TurndownService()
turndownService.use(gfm)

var localPath = 'DocFx/_site/api/'
for(i=0;i<iD[1].length; i++)
{
   inputFilePath = localPath.concat(iD[1][i])
   var  htmlContent= fs.readFileSync(inputFilePath, 'utf8');

   // convert HTML text to MD
   var markdownContent = turndownService.turndown(htmlContent);

   var outputFilePath = iD[1][i];
   outputFilePath = outputFilePath.replace('.html', '.md');
   outputFilePath ='DocFx/'.concat(outputFilePath);
   fs.writeFile(outputFilePath, markdownContent, function (err) {
      if (err) return console.log(err);
   });
}

// Writing titles and sub-titles of Wiki-sidebar to the -Sidebar.md
var outputTitle = '';
for(i=0;i<iD[0].length; i++)
{
	var outputTitle0 = '';
	var outputTitle1 = '';
	var outputTitleMain = '';
	
	if(iD[0][i] == 'expand-stub')
	{
		//text of Main menue of side-bar
		outputTitle0 = iD[1][i];
		outputTitle0 = outputTitle0.replace('.html', '');
		outputTitle1 = '* ['.concat(outputTitle0, '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		outputTitle1= outputTitle1.concat(outputTitle0, ')');
		outputTitleMain = outputTitle1;
	}else 
	{
		//text of Sub menue of side-bar
		outputTitle0 = iD[1][i];
		outputTitle0 = outputTitle0.replace('.html', '');
		//outputTitle0 = outputTitle0.replace(outputTitleMain, '');
		outputTitle1 = '  * ['.concat(outputTitle0.replace(outputTitleMain, ''), '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		outputTitle1 = outputTitle1.concat(outputTitle0, ')');
	}
	
	outputTitle = outputTitle.concat(outputTitle1,'\r\n')
	
}

//_Sidebar.md is pushed to GitHub-Wiki by github-wiki-publish-action
fs.writeFile('DocFx/_Sidebar.md', outputTitle, function (err) {
  if (err) return console.log(err);
});
