var Chart = function () {
    //save array rankValues and array color
    //var color;
    //var rankValues;

    //method draw line
    function drawLine(ctx, startX, startY, endX, endY, color, lineWidth) {
        if (lineWidth !== undefined)
            ctx.lineWidth = lineWidth;
        if (color === undefined)
            color = 'black';
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.stroke();
    }
    //method draw arc
    function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.beginPath();
        if (color !== undefined)
            ctx.fillStyle = color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }
    //method draw rectangle
    function drawRectangle(ctx, startX, startY, width, height, color) {

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(startX, startY, width, height);
        ctx.closePath();
        ctx.fill();
    }
    //method draw text
    function drawText(ctx, posX, posY, text, color, font, maxWidth) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, posX, posY);
        ctx.closePath();
    }
    //method draw Donut slice
    function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }

    //Module draw a donutchart
    var DonutChart = function (options) {

        //var font = "bold 10pt Arial";
        //var fontNotecolor = options.textNoteColor;
        var listValues = options.listValues;
        this.ctx = ctx;
        this.colors = options.colors;
        this.radius = options.radiusDonut;
        this.latitude = options.latitudeDonut;
        this.longitude = options.longitudeDonut;
        ctx.textAlign = "center";
        //draw title
        var titleWidth = ctx.measureText(options.chartName).width;
        drawText(
            ctx,
            this.latitude + this.radius,
            this.longitude - options.titleMargin,
            options.chartName,
            options.fontTitleColor,
            options.fontTitle);
        this.draw = function () {
            //calc total value => percent of every value
            var total_value = 0;
            var color_index = 0;
            var listValuesOther = new Array();
            var listValuePercent = new Array();
            var listValuePercentIndex = 0;
            listValues.sort(function (a, b) {
                return a.levelOfPosition - b.levelOfPosition;
            })
            listValuesOther[listValuesOther.length] = listValues[0].levelOfPosition;
            listValuePercent[listValuePercent.length] = 1;

            for (var i = 1; i < listValues.length; i++) {
                var index = listValuesOther.indexOf(listValues[i].levelOfPosition);
                if (index !== -1) {
                    listValuePercent[index] += 1;
                } else {
                    listValuesOther[listValuesOther.length] = listValues[i].levelOfPosition;
                    listValuePercent[listValuePercent.length] = 1;
                }
            }
            for (var i = 0; i < listValuePercent.length; i++) {
                listValuePercent[i] =
                    Math.round(((listValuePercent[i] / listValues.length) * 100) * 10) / 10;
            }
            //draw pie
            var start_angle = -1.57;        //start position on pie
            for (var i = 0; i < listValuesOther.length; i++) {
                var slice_angle = 2 * Math.PI * (listValuePercent[i] / 100);
                //paremeter center Text Radius usual
                var centerTextRadius = start_angle + slice_angle / 2;
                drawPieSlice(
                    this.ctx,
                    this.radius + this.latitude,
                    this.radius + this.longitude,
                    this.radius,
                    start_angle,
                    start_angle + slice_angle - options.boundaryWidth,
                    this.colors[color_index % this.colors.length]
                );
                //draw text
                var offset = (this.radius * options.donutHoleSize) / 3;
                var labelX = this.latitude + this.radius + (offset + this.radius / 2)
                    * Math.cos(centerTextRadius);
                var labelY = this.longitude + this.radius + (offset + this.radius / 2)
                    * Math.sin(centerTextRadius);
                var width = (start_angle + slice_angle - start_angle);
                //text number percent
                var labelText = listValuePercent[i] + "%";    //to convert decimal to percent
                var textwidth = ctx.measureText(labelText).width;
                var textheight = ctx.measureText('m').width;
                if (labelX < this.radius + this.latitude) {
                    if (width * this.radius < textwidth + 10) {
                        var labelX2 = this.latitude + this.radius + (60 + this.radius / 2)
                    * Math.cos(start_angle + slice_angle / 2);
                        var labelY2 = this.longitude + this.radius + (60 + this.radius / 2)
                            * Math.sin(start_angle + slice_angle / 2);
                        drawLine(ctx, labelX, labelY, labelX2, labelY2);
                        drawLine(ctx, labelX2, labelY2, this.latitude - 10, labelY2);
                        labelX = this.latitude - textwidth;
                        labelY = labelY2;
                    }
                    else {
                        labelX -= width;
                    }
                }
                else {
                    if (width * this.radius < textwidth + 10) {
                        var labelX2 = this.latitude + this.radius + (60 + this.radius / 2)
                    * Math.cos(start_angle + slice_angle / 2);
                        var labelY2 = this.longitude + this.radius + (60 + this.radius / 2)
                            * Math.sin(start_angle + slice_angle / 2);
                        drawLine(ctx, labelX, labelY, labelX2, labelY2);
                        drawLine(ctx, labelX2, labelY2, this.latitude + this.radius * 2 + 10, labelY2);
                        labelX = this.latitude + this.radius * 2 + textwidth;
                        labelY = labelY2;
                    }
                    else {
                        labelX += width + 5;
                    }
                }
                if (labelY > this.radius + this.longitude) {
                    labelY += 10;
                }
                if (labelX > this.latitude && labelX < this.latitude + this.radius * 2)
                    drawText(ctx, labelX, labelY, labelText, options.fontTextColor, options.fontText, 100);
                else
                    drawText(ctx, labelX, labelY, labelText, "black", options.fontText, 100);
                //repare for new loop
                start_angle += slice_angle;
                color_index++;
            }

            //drawing a white circle over the chart to create the donut chart
            drawPieSlice(
                this.ctx,
                this.radius + this.latitude,
                this.radius + this.longitude,
                options.donutHoleSize * Math.min(this.radius, this.radius),
                0,
                2 * Math.PI,
                "#ffffff"
            );
            //draw note
            ctx.textAlign = "left";
            var noteX = this.latitude + this.radius * 2 + options.marginNoteToDonut;
            var noteY = this.longitude;
            var heightTextNote = ctx.measureText('w').width;
            var totalNoteHeight = (listValuesOther.length - 1) * options.noteLineSpacing + heightTextNote;
            console.log
            if (totalNoteHeight < this.radius * 2)
                noteY = this.longitude + this.radius - totalNoteHeight / 2;
            else
                noteY = this.longitude;
            for (var indexlvo = 0; indexlvo < listValuesOther.length; indexlvo++) {
                drawArc(
                    ctx,
                    noteX,
                    noteY,
                    options.noteIconWidth,
                    0,
                    2 * 3.14,
                    options.colors[indexlvo]);

                //drawRectangle(ctx, noteX, noteY, 10, 10, options.colors[indexlvo]);
                drawText(
                    ctx,
                    noteX + options.textNoteMarginLeft,
                    noteY + heightTextNote / 2,
                    listValuesOther[indexlvo],
                    options.fontNotecolor, options.fontNote);
                noteY += options.noteLineSpacing;
            }
        }
    }
    //Module draw a barchat title
    var BarChartTitle = function (options) {
        var font = "13px Arial";
        var fontcolor = "black";
        this.dataInput = options.dataInput;
        this.ctx = options.ctx;
        this.heightTitle = options.heightTitle;
        this.titleColor = options.titleColor;
        this.titleText = options.titleText;
        this.draw = function () {
            drawRectangle(this.ctx,
                0,
                0,
                ctx.canvas.clientWidth,
                this.heightTitle,
                this.titleColor);
        }
    }
    //Module draw a barchart
    var BarChart = function (options) {
        var ctx = options.ctx;
        var widthColumn = 60;
        var heightTitle = 30;
        //parameter design chart
        var columnColor = 'gray';
        var titleColor = '#d3eef8';
        var titleTextColor = 'black';
        var font = "13px Arial";
        var marginToTitle = 10;
        var columnSpace = 5;

        var column_elem_height = 20;
        this.rankValues = options.dataInput.rankValues;
        this.rankColor = options.dataInput.colors;
        this.draw = function () {
            var max = 0;
            for (var categ in rankValues) {
                var val = rankValues[categ];
                if (val > max)
                    max = val;
            }
            ctx.textAlign = 'center';
            var haftcellWidth = (widthColumn / 2);
            var haftcellHeight = (heightTitle / 2) + 5;
            //draw column value number
            for (var i = widthColumn; i < (max + 5) * widthColumn; i += widthColumn) {
                drawRectangle(ctx, i - widthColumn, 0, widthColumn, heightTitle, titleColor);
                var posTextX = i - haftcellWidth;
                drawText(ctx, posTextX, haftcellHeight, i / widthColumn, titleTextColor, font);
                drawLine(ctx, i, 0, i, ctx.canvas.clientHeight, columnColor, 0.1);
            }
            //draw value into chart
            var i = 0;
            for (var categ in rankValues) {
                var val = rankValues[categ];
                drawRectangle(
                    ctx,
                    0,
                    heightTitle + marginToTitle + i * (column_elem_height + columnSpace),
                    val * widthColumn,
                    column_elem_height,
                    this.rankColor[i++]);
            }

        }
    }
    //render excute donut chart
    function renderDonut(renderId, chartData) {
        //create context
        var canvasDonutChart = document.getElementById(renderId);
        canvasDonutChart.width = chartData.widthChart;
        canvasDonutChart.height = chartData.heightChart;
        ctx = canvasDonutChart.getContext("2d");
        //size of circle white in center
        var donutHoleSize = 0.5;
        //margin chart in canvas
        var left = 100;
        var top = 80;
        //text in donut
        //title
        var fontTitle = "bold 12pt Arial";
        var fontTitleColor = "black";
        //note
        var fontNote = "bold 10pt Arial";
        var fontNotecolor = "black";
        var noteIconWidth = 5;
        var textNoteMarginLeft = 15;
        var marginNoteToDonut = 100;
        var noteLineSpacing = 25;
        //text in donut
        var fontText = fontNote;
        var fontTextColor = "white";
        var titleMargin = 50;
        //the line boundary between lide pie
        var boundaryWidth = 0.00;       //radian unit

        var donutChart = new DonutChart({
            ctx: ctx,
            chartName: chartData.chartName,
            listValues: chartData.listValues,
            colors: chartData.listColors,
            donutHoleSize: donutHoleSize,
            radiusDonut: chartData.radius,
            fontTitle: fontTitle,
            fontTitleColor: fontTitleColor,
            fontNote: fontNote,
            fontNotecolor: fontNotecolor,
            latitudeDonut: left,
            longitudeDonut: top,
            fontText: fontText,
            fontTextColor: fontTextColor,
            titleMargin: titleMargin,
            noteIconWidth: noteIconWidth,
            boundaryWidth: boundaryWidth,
            textNoteMarginLeft: textNoteMarginLeft,
            marginNoteToDonut,
            noteLineSpacing: noteLineSpacing
        });
        donutChart.draw();
    }
    //render excute barchart
    function renderBarChart(barChartTitleId, barChartId, dataInput) {
        var titleText = "Rank";
        //use to draw title of every bar
        var canvasTitle = document.getElementById(barChartTitleId);
        //use to draw bar
        var canvasChart = document.getElementById(barChartId);
        var height = 200;
        //width of area Title of BarChart
        canvasTitle.width = 300;
        canvasTitle.height = height;
        //width of area Chart of BarChart
        canvasChart.width = 500;
        canvasChart.height = height;
        ctxtitle = canvasTitle.getContext("2d");
        ctxchart = canvasChart.getContext("2d");
        rankValues = dataInput.rankValues;
        colors = dataInput.colors;
        //parameter to design chart
        var heightTitle = 30;
        var heightElement = 40;
        var titleColor = "#dddee1";
        var barChartTitle = new BarChartTitle({
            ctx: ctxtitle,
            dataInput: dataInput,
            heightTitle: heightTitle,
            heightElement: heightElement,
            titleColor: titleColor,
            titleText: titleText
        });
        barChartTitle.draw();
        var barchart = new BarChart({
            ctx: ctxchart,
            dataInput: dataInput
        });
        barchart.draw();
    }
    return {
        renderDonut: renderDonut,
        renderBarChart: renderBarChart
    }
}();
