var Chart = function () {
    //methods support
    //method draw line
    var arcs = [];
    var CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SpringGreen", "SteelBlue", "Tomato", "Turquoise"];
    var contex;
    var canvasOffset;
    var offsetX;
    var offsetY;
    var leftDonut = 0;
    var rightDonut = 0;
    var donutChart;
    var canvasTooltip;
    var canvasTooltipCtx;
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
            ctx.strokeStyle = color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.stroke();
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
            ctx.canvas.width / 2,
            this.longitude - options.titleMargin,
            options.chartName,
            options.fontTitleColor,
            options.fontTitle);
        //calc total value => percent of every value
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
            var titleWidth = ctx.measureText(options.chartName).width;
            drawText(
                ctx,
                ctx.canvas.width / 2,
                this.longitude - options.titleMargin,
                options.chartName,
                options.fontTitleColor,
                options.fontTitle);
            ////calc total value => percent of every value
            //var total_value = 0;
            //var color_index = 0;
            //var listValuesOther = new Array();
            //var listValuePercent = new Array();
            //var listValuePercentIndex = 0;
            //ctx.lineWidth = this.radius - options.donutHoleSize * this.radius;
            //this.radius -= ctx.lineWidth / 2;
            //listValues.sort(function (a, b) {
            //    return a.y - b.y;
            //});
            //listValuesOther[listValuesOther.length] = listValues[0].y;
            //listValuePercent[listValuePercent.length] = 1;

            //for (var i = 1; i < listValues.length; i++) {
            //    var index = listValuesOther.indexOf(listValues[i].y);
            //    if (index !== -1) {
            //        listValuePercent[index] += 1;
            //    } else {
            //        listValuesOther[listValuesOther.length] = listValues[i].y;
            //        listValuePercent[listValuePercent.length] = 1;
            //    }
            //}
            //for (var i = 0; i < listValuePercent.length; i++) {
            //    listValuePercent[i] = (listValuePercent[i] / listValues.length) * 100;
            //}

            ////prepare array color for not enoungt color
            //var indexColor = CSS_COLOR_NAMES.length - 1;
            //for (var i = this.colors.length; i < listValuesOther.length; i++) {
            //    this.colors[this.colors.length] = CSS_COLOR_NAMES[indexColor--];
            //}


            //draw pie
            var start_angle = -1.57;        //start position on pie
            var oldLocation = 0;
            var marginTextToDonut = 60;
            var lineDonutToTextSmall = 30;
            var arraySmallPieTop = new Array();
            var arraySmallPieBottom = new Array();
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
                //text number percent
                var labelText = Math.round(listValuePercent[i] * 10) / 10 + "%";    //to convert decimal to percent
                var textwidth = ctx.measureText(labelText).width;
                var textheight = ctx.measureText('m').width;
                
                if (width * (this.radius + ctx.lineWidth ) < textwidth + 14) {
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
                if (labelX > this.latitude && labelX < this.latitude + this.radius * 2)
                    drawText(ctx, labelX, labelY, labelText, options.fontTextColor, options.fontText, 100);
                else
                    drawText(ctx, labelX, labelY, labelText, "black", options.fontText, 100);
                //
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
            for (var indexlvo = 0; indexlvo < listValuesOther.length; indexlvo++) {
                if (options.noteStyle === 'circle')
                    drawArc(
                    ctx,
                    noteX,
                    noteY,
                    options.noteIconWidth,
                    0,
                    2 * 3.14,
                    options.colors[indexlvo]);
                else
                    drawRectangle(
                        ctx,
                        noteX,
                        noteY - 5,
                        10,
                        10,
                        options.colors[indexlvo % this.colors.length]);
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
    function defineArc(arc) {
        contex.beginPath();
        contex.arc(arc.cx, arc.cy, arc.radius, arc.start, arc.end);
    }
    function handleMouseMove(e) {
        // get mouse position
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);
        // reset the results box to invisible
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
                drawText(canvasTooltipCtx, canvasTooltip.width / 2, 15, arcs[i].value + ": " +arcs[i].text, 'blue', canvasTooltipCtx.font);
                hit = true;
                break;
            }
        }
        if (!hit) {
            canvasTooltip.style.left = "-200px";
        }
    }
    //render excute donut chart
    function renderDonut(renderId,tooltipId, chartData) {
        //create context
        var canvasDonutChart = document.getElementById(renderId);
        canvasDonutChart.width = chartData.widthChart;
        canvasDonutChart.height = chartData.heightChart;
        ctx = canvasDonutChart.getContext("2d");
        //size of circle white in center
        
        var donutHoleSize = 0.5;
        //margin chart in canvas
        var left = 100;
        var top = 110;
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
        var noteStyle = 'rect'        //  circle/rect
        //text in donut
        var fontText = fontNote;
        var fontTextColor = "white";
        var titleMargin = 80;

        canvasTooltip = document.getElementById(tooltipId);
        canvasTooltip.width = 50;
        canvasTooltip.height = 25;
        canvasTooltipCtx = canvasTooltip.getContext("2d");
        canvasTooltipCtx.textAlign = 'center';
        canvasTooltipCtx.font = fontText;
        //the line boundary between lide pie
        var boundaryWidth = 0.00;       //radian unit
        canvasOffset = $("#" + renderId).offset();
        var canvas = document.getElementById(renderId);
        var rect = canvas.getBoundingClientRect();
        offsetX = rect.left;
        offsetY = rect.top;
        contex = ctx;
        $("#" + renderId).mousemove(function (e) {
            handleMouseMove(e);
        });
        //load parameter
        //donutHoleSize = chartData.donutHoldSize == null ? 





        donutChart = new DonutChart({
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
            noteLineSpacing: noteLineSpacing,
            noteStyle: noteStyle
        });
        donutChart.draw();
    }
    return {
        renderDonut: renderDonut,
    }
}();

