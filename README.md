DIVCharts - SVG/Canvas-less Bar Charts
================================

DIVCharts allows you to create vertical bar charts without needing to use SVG or Canvas elements

\<head\> section includes
---
	<link rel="stylesheet" type="text/css" href="divcharts.css"/>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="plugins/jquery.hoverIntent.minified.js"></script>
	<script type="text/javascript" src="divcharts.js"></script>

Usage
---

	var chart = $('container').DivChart({ options });
	
Customization Options
---

**Required Options:**~~~~~~~~~~~~~~~~~~~~~

**labels**: (Default: [])
- An array of X-axis labels

**Optional Options:**~~~~~~~~~~~~~~~~~~~~~

**values**: (Default: [])
- An array of numeric values. If no values are initially given, they must be added using the update function.

**width**: (Default: '95%')
- Number (in pixels) or a percentage

**height**: (Default: 300)
- Number (in pixels) or a percentage

**ymin**: (Default: 0)
- Integer value

**ymax**: (Default: 100)
- Integer value

**colors**: (Default: ['#AA4643','#89A54E', '#80699B', '#3D96AE', '#DB843D'])
- An array of color strings (must be at least the number of labels you have).

Functions
---

**init({\<options\>})** - Called when the DIVChart is instanciated.
- options: (see above)

Example:

	//instanciate the chart
	var chart = $('container').DivChart({ ... });

**update({ values: [\<numbers\>], index: \<int\> })** - Used to update bar values.
- values: Array of numbers to set on the chart
- index: Optional. Where the update starts. No index means 0. 

Example:

	//update 2nd and 3rd categories
	chart.DivChart('update', {values: [5,10], index: 1});

**stop()** - Call this to clean up the animation queue if you're changing values frequently.

**destroy()** - Call this to clean up the chart from the DOM.

Chart Variables available to the user (dcvars)
---

- width: Actual width of the chart
- height: Actual height of the chart
- labels: Labels used to set up the chart
- max: Y-max value
- min: Y-min value
- barHeights: An array of the heights of the bars (in pixels)
- currValues: An array of the current values of the bars in the chart

Example Usage:

	chart.dcvars.barHeights
	
Want to animate your chart? It's easy! Check out **graph_test.html** to see how!

Enjoy!