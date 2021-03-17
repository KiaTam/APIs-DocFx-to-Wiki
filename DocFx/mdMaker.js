// Converts and exports HTML files (which are generated by DocFx) to Github flavoured Markdown which is published on the GitHub-Wiki.
//
// Notes: 
// - Path to DocFx could be modified by changing docFxPath.
// - Input files (HTML) are in the 'same path'/__site/api/
// - MD files are exported to the 'same path'/__site

const fs=require('fs');

// Cheerio is used for crawling in HTMLfiles.
const cheerio = require('cheerio');

//
var docFxPath = 'DocFx';

// Load toc.html to be analysed (crawled) by Cheerio.
var inputFilePath =docFxPath.concat('/_site/api/toc.html');
var tocData = fs.readFileSync(inputFilePath, 'utf8');
const $ = cheerio.load(tocData);

// Crawling in the loaded data from toc.HTML to extract the name of HTML files.
const iD = [[],[]];
$("li").each(function(i,element){
		
	iD[0][i] = $(element)
	.find('span')
	.attr('class');
	
	
	iD[1][i] = $(element)
	.find('a')
	.attr('href');	
});
	
// Turndown converts HTML fille format text to Markdown.
var TurndownService = require('turndown')

// The turndown-plugin-gfm is a Turndown plugin which adds GitHub Flavored Markdown extensions.
var turndownPluginGfm = require('turndown-plugin-gfm')

var gfm = turndownPluginGfm.gfm
var turndownService = new TurndownService()

// Import plugins from turndown-plugin-gfm.
var turndownPluginGfm = require('turndown-plugin-gfm')
var gfm = turndownPluginGfm.gfm
var tables = turndownPluginGfm.tables
var strikethrough = turndownPluginGfm.strikethrough


// Use the gfm plugin.
turndownService.use(gfm)
turndownService.use(tables)

// Read the HTML files and converts them to Markdown and stores them.
var localPath = docFxPath.concat('/_site/api/');

for(i=0;i<iD[1].length; i++)
{
   inputFilePath = localPath.concat(iD[1][i])
   var  htmlContent= fs.readFileSync(inputFilePath, 'utf8');
	   
   // Convert HTML text to MD.
   var markdownContent = turndownService.turndown(htmlContent);
	
   // Delete '.html' from the links in order to be used by GitHub-Wiki.
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

   // Fix the problem regarding syntax of tables.
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
	
   // Save the modified MD file	
   var outputFilePath = iD[1][i];
   outputFilePath = outputFilePath.replace('.html', '.md');
   outputFilePath ='DocFx/'.concat(outputFilePath);
   fs.writeFile(outputFilePath, markdownContent, function (err) {
      if (err) return console.log(err);
   });
}

// Add .md files of Development folder
// Text of Main menue of side-bar
var wikiAddress ='](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/';
var sidebarTitles = '';
var sidebarTitle0 = '';
var sidebarTitle1 = '';
var sidebarTitleMain;
sidebarTitle0 = 'DevelopmentDocumentations';
sidebarTitleMain = sidebarTitle0;
sidebarTitleMain = sidebarTitleMain.concat('.');
sidebarTitle1 = '* ['.concat(sidebarTitle0, wikiAddress);
sidebarTitle1= sidebarTitle1.concat(sidebarTitle0, ')');
sidebarTitles = sidebarTitles.concat('* Development Documentations','\r\n');

var docsFolder = 'Documentation/Development';

var files = fs.readdirSync(docsFolder);

for(i=0;i<files.length; i++)
{
    	//Text of Sub side-bar menue.
	sidebarTitle0 = files[i];
	if ( sidebarTitle0.includes('.md'))
	{
		sidebarTitle0 = sidebarTitle0.replace('.md', '');
		// Shorten text of sub-menue by skipping the long beginning of it. e.g. skipps Volkswagen.Unity.Framework.Core. on the sub-menue.
		var sidebarTitleTmp = sidebarTitle0.replace(sidebarTitleMain, '');
		
		sidebarTitle1 = '  * ['.concat(sidebarTitleTmp , wikiAddress);
		sidebarTitle1 = sidebarTitle1.concat(sidebarTitle0, ')');
		sidebarTitles = sidebarTitles.concat(sidebarTitle1,'\r\n');

	}

};


// 1. Modify address to the images in .md files.
// 2. Write .md files to the folder.

var fileNames = fs.readdirSync(docsFolder);
var imagesAddress = '(https://github.com/KiaTam/APIs-DocFx-to-Wiki/blob/master/Documentation/Development/images/';
for(var i=0;i<fileNames.length;i++)
{
			if (fileNames[i] != 'images')
			{
				var mdFileData;
				var inputFilePath = docsFolder.concat('/');
				var tmp = fileNames[i];
				inputFilePath = inputFilePath.concat(tmp);
				mdFileData = fs.readFileSync(inputFilePath, 'utf8');
			
				while(mdFileData.includes('(images/')){			
					mdFileData = mdFileData.replace('(images/', imagesAddress)
				}
			
				// Delete [improve this Doc] string
				// var str = "[Improve this Doc](https://github.com/volkswagen-group-unity-framework/vwg.umodul.framework-next/new/1a8478eb6624e4979fcb0fbf0d521fa114f89cfa/apiSpec/new?filename=Volkswagen_Unity_Framework_ModuleDefinitionLanguage_MethodDefinition_AccessModifier.md&value=---%0Auid%3A%20Volkswagen.Unity.Framework.ModuleDefinitionLanguage.MethodDefinition.AccessModifier%0Asummary%3A%20'*You%20can%20override%20summary%20for%20the%20API%20here%20using%20*MARKDOWN*%20syntax'%0A---%0A%0A*Please%20type%20below%20more%20information%20about%20this%20API%3A*%0A%0A) [View Source]";
				var firstString = '[Improve this Doc]';
				while(mdFileData.includes(firstString)){			
					
					var mySubString = mdFileData.substring(
						mdFileData.lastIndexOf(firstString) + firstString.length, 
						mdFileData.lastIndexOf("[View Source]"));
					mdFileData = mdFileData.replace(mySubString, '');
					mdFileData = mdFileData.replace('| [Improve this Doc]', '');
					mdFileData = mdFileData.replace(firstString, '');
				}
			
				//write the result to the folder
				var outputFilePath = docFxPath.concat('/');
				outputFilePath = outputFilePath.concat(fileNames[i]);
				console.log(outputFilePath);
				fs.writeFile(outputFilePath, mdFileData, function (err) {
					// if (err) return console.log(err);
				});
			}
	
	
	
	
}


// 1. Sort and writes titles and sub-titles of Wiki-sidebar to the _Sidebar.md.
// 2. Write the result in the _sidebar.md which is used for side-bar of the Wiki.  

// var wikiAddress ='](https://github.com/KiaTam/APIs-DocFx-to-Wiki/wiki/';
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
		sidebarTitle1 = '* ['.concat(sidebarTitle0, wikiAddress);
		sidebarTitle1= sidebarTitle1.concat(sidebarTitle0, ')');
	}else 
	{
		//text of Sub menue of side-bar
		sidebarTitle0 = iD[1][i];
		sidebarTitle0 = sidebarTitle0.replace('.html', '');
		//shortens text of sub-menue by skipping the long beginning of it. e.g. skipps Volkswagen.Unity.Framework.Core. on the sub-menue
		var sidebarTitleTmp = sidebarTitle0.replace(sidebarTitleMain, '');
		
		sidebarTitle1 = '  * ['.concat(sidebarTitleTmp , wikiAddress);
		sidebarTitle1 = sidebarTitle1.concat(sidebarTitle0, ')');
	}
	
	sidebarTitles = sidebarTitles.concat(sidebarTitle1,'\r\n');
	
}

// Write the sidebarTitles to _Sidebar.md.
// Note: The file _Sidebar.md is pushed to GitHub-Wiki by in the GitHub workflow by github-wiki-publish-action
var outputFilePath = docFxPath.concat('/_Sidebar.md');
fs.writeFile(outputFilePath, sidebarTitles, function (err) {
  if (err) return console.log(err);
});






