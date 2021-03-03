// Convers and exports HTML files (which are generated by DocFx) to Github flavoured Markdown 
//
// Hints: Path to DocFx could be modified by changing docFxPath.
//        Input files (HTML) are in the 'same path'/__site/api/
// 	  MD files are exported to the 'same path'/__site

const fs=require('fs');

// Cheerio is used for crawling in HTML files
const cheerio = require('cheerio');

//
var docFxPath = 'DocFx';

// Load toc.html to be analysed (crawled) by Cheerio
var inputFilePath =docFxPath.concat('/_site/api/toc.html');
var tocData = fs.readFileSync(inputFilePath, 'utf8');
const $ = cheerio.load(tocData);

// Crawling in the loaded data from toc.HTML to extract the name of HTML files
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

// Import plugins from turndown-plugin-gfm
var turndownPluginGfm = require('turndown-plugin-gfm')
var gfm = turndownPluginGfm.gfm
var tables = turndownPluginGfm.tables
var strikethrough = turndownPluginGfm.strikethrough


// Use the gfm plugin
turndownService.use(gfm)
turndownService.use(tables)

// Use the table and strikethrough plugins only
//turndownService.use([tables, strikethrough])

// Reads the HTML files and converts them to Markdown and stores them.
var localPath = docFxPath.concat('/_site/api/');

for(i=0;i<iD[1].length; i++)
{
   inputFilePath = localPath.concat(iD[1][i])
   var  htmlContent= fs.readFileSync(inputFilePath, 'utf8');
	   
   // convert HTML text to MD
   var markdownContent = turndownService.turndown(htmlContent);
	
   // delete '.html' from the links in order to be used by GitHub-Wiki
   const $ = cheerio.load(htmlContent);
   const hrefs = [];
   $('div').each(function(i, element) {
	 hrefs [i] = $(element)
	.find('a')
	.attr('href');
   });

   for(j=0;j<hrefs.length; j++)
   {
         markdownContent = markdownContent.replace('.html', '');
   }
	
   markdownContent = markdownContent.replace('Show / Hide Table of Contents', '');

   // Fix the problem regarding syntax of tables
   var matches = markdownContent.match(/---/g);
   
   if ( matches != null)
   {
      
     for(j=0;j<(((matches.length)/2) + 1); j++)
     {
       markdownContent = markdownContent.replace('|\n' , '|');//one for each line
       markdownContent = markdownContent.replace('| \n' , '|');
   
       markdownContent = markdownContent.replace('|\n' , '|');
       markdownContent = markdownContent.replace('| \n' , '|');
   
       markdownContent = markdownContent.replace('|\n' , '|');
       markdownContent = markdownContent.replace('| \n' , '|');
   
       markdownContent = markdownContent.replace('|\n' , '|');
       markdownContent = markdownContent.replace('| \n' , '|');
     }
     for(j=0;j<(((matches.length)/2) + 1); j++)
     {
       markdownContent = markdownContent.replace('\n\n |' , '|');//one for each line
       markdownContent = markdownContent.replace('\n\n |' , '|');
       markdownContent = markdownContent.replace('\n\n |' , '|');
       markdownContent = markdownContent.replace('\n\n |' , '|');//one for each line
     }
     for(j=0;j<(((matches.length)/2) + 1); j++)
     {
       markdownContent = markdownContent.replace('||' ,'|\n|');
       markdownContent = markdownContent.replace('||' ,'|\n|');
       markdownContent = markdownContent.replace('||' ,'|\n|');
       markdownContent = markdownContent.replace('||' ,'|\n|');
	 }
   }
	
   // save the modified MD file	
   var outputFilePath = iD[1][i];
   outputFilePath = outputFilePath.replace('.html', '.md');
   outputFilePath ='DocFx/'.concat(outputFilePath);
   fs.writeFile(outputFilePath, markdownContent, function (err) {
      if (err) return console.log(err);
   });
}

// Sorts and writes titles and sub-titles of Wiki-sidebar to the _Sidebar.md.
// Writes the result in the _sidebar.md which is used on for the side-bar of Wiki.  
var sidebarTitles = '';
for(i=0;i<iD[0].length; i++)
{

    var sidebarTitle0 = '';
	var sidebarTitle1 = '';
	var sidebarTitleMain;
	
	if(iD[0][i] == 'expand-stub')
	{
		//text of Main menue of side-bar
		sidebarTitle0 = iD[1][i];
		sidebarTitle0 = sidebarTitle0.replace('.html', '');
		sidebarTitleMain = sidebarTitle0;
		sidebarTitleMain = sidebarTitleMain.concat('.');
		sidebarTitle1 = '* ['.concat(sidebarTitle0, '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		sidebarTitle1= sidebarTitle1.concat(sidebarTitle0, ')');
	}else 
	{
		//text of Sub menue of side-bar
		sidebarTitle0 = iD[1][i];
		sidebarTitle0 = sidebarTitle0.replace('.html', '');
		//shortens text of sub-menue by skipping the long beginning of it. e.g. skipps Volkswagen.Unity.Framework.Core. on the sub-menue
		var sidebarTitleTmp = sidebarTitle0.replace(sidebarTitleMain, '');
		
		sidebarTitle1 = '  * ['.concat(sidebarTitleTmp , '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		sidebarTitle1 = sidebarTitle1.concat(sidebarTitle0, ')');
	}
	
	sidebarTitles = sidebarTitles.concat(sidebarTitle1,'\r\n');
	
}


// add .md files of Development folder
// text of Main menue of side-bar
var sidebarTitle0 = '';
var sidebarTitle1 = '';
var sidebarTitleMain;
sidebarTitle0 = 'Development Documentations';
sidebarTitleMain = sidebarTitle0;
sidebarTitleMain = sidebarTitleMain.concat('.');
sidebarTitle1 = '* ['.concat(sidebarTitle0, '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
sidebarTitle1= sidebarTitle1.concat(sidebarTitle0, ')');
sidebarTitles = sidebarTitles.concat('* Development Documentations','\r\n');

var docsFolder = 'Documentation/Development';

var files = fs.readdirSync(docsFolder);

for(i=0;i<files.length; i++)
{
    	//text of Sub menue of side-bar
	sidebarTitle0 = files[i];
	if ( sidebarTitle0.includes('.md'))
	{
		sidebarTitle0 = sidebarTitle0.replace('.md', '');
		// shortens text of sub-menue by skipping the long beginning of it. e.g. skipps Volkswagen.Unity.Framework.Core. on the sub-menue
		var sidebarTitleTmp = sidebarTitle0.replace(sidebarTitleMain, '');
		
		sidebarTitle1 = '  * ['.concat(sidebarTitleTmp , '](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/');
		sidebarTitle1 = sidebarTitle1.concat(sidebarTitle0, ')');
		sidebarTitles = sidebarTitles.concat(sidebarTitle1,'\r\n');

	}

};



// write Developer documentations
var ncp = require('ncp').ncp;

ncp.limit = 16;
var source = docsFolder;

var destination = 'DocFx';

//ncp(source, destination, function (err) {
// if (err) {
//   return console.error(err);
// }
// console.log('done!');
//});

var fileNames = fs.readdirSync(docsFolder);

for(var i=0;i<fileNames.length;i++)
{
		if (fileNames[i] != 'images')
		{
			var mdFilaData
			var inputFilePath =docsFolder.concat('/');
			var tmp = fileNames[i];
			inputFilePath =inputFilePath.concat(tmp);
			mdFilaData= fs.readFileSync(inputFilePath, 'utf8');
			mdFilaData = mdFilaData.replaceAll('(images/', '(https://github.com/KiaTam/APIs-DocFx-to-Wiki/blob/master/Documentation/Development/images/')
			var outputFilePath = docFxPath.concat('/');
			var outputFilePath = outputFilePath.concat(fileNames[i]);
			console.log(outputFilePath);
			//fs.writeFile(outputFilePath, mdFilaData, function (err) {
			//	if (err) return console.log(err);
			//});
		}
}


// sidebarTitles.concat(sidebarTitle1,'\r\n')

// Writes the sidebarTitles to _Sidebar.md.
// Hint: The file _Sidebar.md is pushed to GitHub-Wiki by in the GitHub workflow by github-wiki-publish-action
var outputFilePath = docFxPath.concat('/_Sidebar.md');
fs.writeFile(outputFilePath, sidebarTitles, function (err) {
  if (err) return console.log(err);
});






