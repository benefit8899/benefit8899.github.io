var Chart = function () {
    //methods support
    //method draw line
    var arcs = [];
    var CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SpringGreen", "SteelBlue", "Tomato", "Turquoise"];
    var contex;
    var canvasOffset;
    var offsetX = 0;
    var offsetY = 0;
    var leftDonut = 0;
    var rightDonut = 0;
    var donutChart;
    var canvasTooltip;
    var canvasTooltipCtx;
    var colorSmallText = "black";
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
        ctx.strokeStyle = color;
        ctx.beginPath();
        //ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        //ctx.closePath();
        ctx.stroke();
    }

    //Module draw a donutchart
    var DonutChart = function (options) {
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
            ctx.canvas.width / 2,
            options.titleMarginToTop,
            options.chartName,
            options.fontTitleColor,
            options.fontTitle);
        //repare values, calc total value => percent of every value
        var total_value = 0;
        var color_index = 0;
        var listValuesOther = new Array();
        var listValuePercent = new Array();
        var listValuePercentIndex = 0;
        ctx.lineWidth = this.radius - options.donutHoleSize * this.radius;
        this.radius -= ctx.lineWidth / 2;
        listValues.sort(function (a, b) {
            return a.y - b.y;
        });
        listValuesOther[listValuesOther.length] = listValues[0].y;
        listValuePercent[listValuePercent.length] = 1;

        for (var i = 1; i < listValues.length; i++) {
            var index = listValuesOther.indexOf(listValues[i].y);
            if (index !== -1) {
                listValuePercent[index] += 1;
            } else {
                listValuesOther[listValuesOther.length] = listValues[i].y;
                listValuePercent[listValuePercent.length] = 1;
            }
        }
        for (var i = 0; i < listValuePercent.length; i++) {
            listValuePercent[i] = (listValuePercent[i] / listValues.length) * 100;
        }
        //prepare array color for not enoungt color
        var indexColor = CSS_COLOR_NAMES.length - 1;
        for (var i = this.colors.length; i < listValuesOther.length; i++) {
            this.colors[this.colors.length] = CSS_COLOR_NAMES[indexColor--];
        }

        this.draw = function () {
            //draw pie
            var start_angle = options.donutStart;        //start position on pie
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
                var offset = ((this.radius + ctx.lineWidth * 2) * options.donutHoleSize) / 2.5;
                var labelX = this.latitude + this.radius + (offset + this.radius / 2)
                    * Math.cos(centerTextRadius);
                var labelY = this.longitude + this.radius + (offset + this.radius / 2)
                    * Math.sin(centerTextRadius);
                var width = (start_angle + slice_angle - start_angle);
                //text number percent, round get 1 decimal to show
                var labelText = Math.round(listValuePercent[i] * 10) / 10 + "%";
                var textwidth = ctx.measureText(labelText).width;
                var textheight = ctx.measureText('m').width;
                //check small for hinden text not fit
                if (width * (this.radius + ctx.lineWidth) < textwidth + 14) {
                    arcs.push({
                        cx: this.radius + this.latitude,
                        cy: this.radius + this.longitude,
                        radius: this.radius,
                        start: start_angle,
                        end: start_angle + slice_angle - options.boundaryWidth,
                        text: labelText,
                        color: this.colors[color_index % this.colors.length],
                        value: listValuesOther[i]
                    });
                    start_angle += slice_angle;
                    color_index++;
                    continue;
                }
                if (labelY > this.radius + this.longitude) {
                    labelY += 10;
                }
                drawText(ctx, labelX, labelY, labelText, options.fontTextColor, options.fontText);
                //repare for new loop
                start_angle += slice_angle;
                color_index++;
            }
            //draw note
            ctx.textAlign = "left";
            var noteX = this.latitude + this.radius * 2 + options.marginNoteToDonut;
            var noteY = this.longitude;
            var heightTextNote = ctx.measureText('w').width;
            var totalNoteHeight = (listValuesOther.length - 1) * options.noteLineSpacing + heightTextNote;
            if (totalNoteHeight < this.radius * 2)
                noteY = this.longitude + this.radius - totalNoteHeight / 2;
            else
                noteY = this.longitude;
            //if (options.noteStyle === 'circle')
                ctx.lineWidth = options.noteIconWidth /1.5;
            for (var indexlvo = 0; indexlvo < listValuesOther.length; indexlvo++) {
                var labelText = Math.round(listValuePercent[indexlvo] * 10) / 10 + "%";
                if (options.noteStyle === 'circle')
                    drawPieSlice(
                    ctx,
                    noteX,
                    noteY,
                    ctx.lineWidth/2,
                    0,
                    2 * Math.PI,
                    options.colors[indexlvo]);
                else
                    drawRectangle(
                        ctx,
                        noteX,
                        noteY - options.noteIconWidth /2,
                        options.noteIconWidth,
                        options.noteIconWidth,
                        options.colors[indexlvo % this.colors.length]);
                arcs.push({
                    cx: noteX,
                    cy: noteY,
                    radius: 1,
                    start: 0,
                    end: 2 * Math.PI,
                    text: labelText,
                    color: "black",
                    value: listValuesOther[indexlvo]
                });
                drawText(
                    ctx,
                    noteX + options.noteIconWidth + options.textNoteMarginLeft,
                    noteY + heightTextNote / 2,
                    listValuesOther[indexlvo],
                    options.fontNotecolor, options.fontNote);
                noteY += options.noteLineSpacing;
            }
        }
    }
    function defineArc(arc) {
        contex.beginPath();
        contex.arc(arc.cx, arc.cy, arc.radius, arc.start, arc.end);
    }
    function handleMouseMove(e) {
        // get mouse position
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);
        // hit-test each arc
        var hit = false;
        
        for (var i = 0; i < arcs.length; i++) {
            // define one arc
            defineArc(arcs[i]);
            // test that one arc
            if (contex.isPointInStroke(mouseX, mouseY)) {
                canvasTooltip.style.left = e.clientX + "px";
                canvasTooltip.style.top = e.clientY - canvasTooltip.height + "px";
                canvasTooltipCtx.clearRect(0, 0, canvasTooltip.width, canvasTooltip.height);
                
                var textHiehgt = canvasTooltipCtx.measureText('w').width;
                drawText(canvasTooltipCtx, canvasTooltip.width / 2, canvasTooltip.height / 2 + textHiehgt / 2, arcs[i].value + ": " + arcs[i].text, colorSmallText, canvasTooltipCtx.font);
                hit = true;
                break;
            }
        }
        if (!hit) {
            canvasTooltip.style.left = "-3000px";
        }
    }
    //render excute donut chart
    function renderDonut(renderId, tooltipId, chartData) {
        //create context
        var canvasDonutChart = document.getElementById(renderId);
        canvasDonutChart.width = chartData.widthChart;
        canvasDonutChart.height = chartData.heightChart;
        ctx = canvasDonutChart.getContext("2d");
        //load parameter
        var textNoteMarginLeft = chartData.textNoteMarginLeft != null ? chartData.textNoteMarginLeft : 15;
        var donutHoleSize = chartData.donutHoldSize != null ? chartData.donutHoldSize : 0.5;
        var left = chartData.donutLeft != null ? chartData.donutLeft : 100;
        var top = chartData.donutTop != null ? chartData.donutTop : 110;
        var fontTitle = chartData.titleFont != null ? chartData.titleFont : "bold 12pt Arial";
        var fontTitleColor = chartData.titleColor != null ? chartData.titleColor : "black";
        var titleMarginToTop = chartData.titleMarginToTop != null ? chartData.titleMarginToTop : 40;
        var fontNote = chartData.noteFont != null ? chartData.noteFont : "bold 10pt Arial";
        var fontNotecolor = chartData.noteColor != null ? chartData.noteColor : "black";
        var noteStyle = chartData.noteStyle != null ? chartData.noteStyle : "circle";
        var noteLineSpacing = chartData.noteColorSpacing != null ? chartData.noteColorSpacing : 25;
        var donutFont = chartData.donutFont != null ? chartData.donutFont : "bold 10pt Arial";
        var donutColor = chartData.donutColor != null ? chartData.donutColor : "white";
        var donutStart = chartData.donutStart != null ? chartData.donutStart : -1.57;
        var donutSmallFont = chartData.donutSmallFont != null ? chartData.donutSmallFont : "bold 10pt Arial";
        var donutSmallColor = chartData.donutSmallColor != null ? chartData.donutSmallColor : "blue";
        var donutSmallBoxWidth = chartData.donutSmallBoxWidth != null ? chartData.donutSmallBoxWidth : 60;
        var donutSmallBoxHeight = chartData.donutSmallBoxHeight != null ? chartData.donutSmallBoxHeight : 25;
        var marginNoteToDonut = chartData.noteMarginToDonut != null ? chartData.noteMarginToDonut : 100;
        var boundaryWidth = chartData.boundaryWidth != null ? chartData.boundaryWidth : 0;
        var noteIconWidth = chartData.noteIconWidth != null ? chartData.noteIconWidth : 10;
        var listColors = chartData.listColors != null ? chartData.listColors : new Array();
        var chartName = chartData.chartName != null ? chartData.chartName : "";
        colorSmallText = donutSmallColor;
        //canvas to hover
        canvasTooltip = document.getElementById(tooltipId);
        canvasTooltip.width = donutSmallBoxWidth;
        canvasTooltip.height = donutSmallBoxHeight;
        canvasTooltipCtx = canvasTooltip.getContext("2d");
        canvasTooltipCtx.textAlign = 'center';
        canvasTooltipCtx.font = donutSmallFont;
        canvasOffset = $("#" + renderId).offset();
        var canvas = document.getElementById(renderId);
        var rect = canvas.getBoundingClientRect();
        offsetX = rect.left;
        offsetY = rect.top;
        contex = ctx;
        //handle event mouse move in canvas
        $("#" + renderId).mousemove(function (e) {
            handleMouseMove(e);
        });
        //create a donut chart
        donutChart = new DonutChart({
            donutStart: donutStart,
            ctx: ctx,
            chartName: chartName,
            listValues: chartData.listValues,
            colors: listColors,
            donutHoleSize: donutHoleSize,
            radiusDonut: chartData.radius,
            fontTitle: fontTitle,
            fontTitleColor: fontTitleColor,
            fontNote: fontNote,
            fontNotecolor: fontNotecolor,
            latitudeDonut: left,
            longitudeDonut: top,
            fontText: donutFont,
            fontTextColor: donutColor,
            titleMargin: titleMarginToTop,
            noteIconWidth: noteIconWidth,
            boundaryWidth: boundaryWidth,
            textNoteMarginLeft: textNoteMarginLeft,
            marginNoteToDonut,
            noteLineSpacing: noteLineSpacing,
            noteStyle: noteStyle,
            titleMarginToTop: titleMarginToTop
        });
        donutChart.draw();
    }
    return {
        renderDonut: renderDonut,
    }
}();

