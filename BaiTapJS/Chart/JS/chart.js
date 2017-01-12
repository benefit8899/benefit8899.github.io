var Chart = function () {
    //save array rankValues and array color
    var color;
    var rankValues;

    //method draw line
    function drawLine(ctx, startX, startY, endX, endY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    //method draw arc
    function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
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
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, posX, posY, maxWidth);
        //var labelText = Math.round((percent * 100) * 10) / 10;
        //this.ctx.fillStyle = "black";
        //this.ctx.font = "bold 12px Arial";
        //this.ctx.fillText(labelText + "%", labelX, labelY, 30);
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
    //method draw a donutchart
    var Doughnutchart = function (options) {
        console.log();
        this.options = options;
        this.ctx = ctx;
        this.colors = options.colors;
        this.radius = options.radiusDonut;
        this.latitude = options.latitudeDonut;
        this.longitude = options.longitudeDonut;

        
        this.draw = function () {
            //calc total value => percent of every value
            var total_value = 0;
            var color_index = 0;
            for (var categ in rankValues) {
                var val = rankValues[categ];
                total_value += val;
            }
            //draw pie
            var start_angle = -1.57;
            for (categ in rankValues) {
                val = rankValues[categ];
                var percent = val / total_value;
                var slice_angle = 2 * Math.PI * percent;
                drawPieSlice(
                    this.ctx,
                    this.radius + this.latitude,
                    this.radius + this.longitude,
                    this.radius,
                    start_angle,
                    start_angle + slice_angle,
                    this.colors[color_index % this.colors.length]
                );
                //draw text
                var offset = (this.radius * this.options.donutHoleSize) / 3;
                var labelX = this.latitude + this.radius + (offset + this.radius / 2)
                    * Math.cos(start_angle + slice_angle / 2);
                var labelY = this.longitude + this.radius + (offset + this.radius / 2)
                    * Math.sin(start_angle + slice_angle / 2);
                var width = (start_angle + slice_angle - start_angle) * 10;
                if (labelX < this.radius + this.latitude) {
                    if (width < 3.1) {
                        var labelX2 = this.latitude + this.radius + (60 + this.radius / 2)
                    * Math.cos(start_angle + slice_angle / 2);
                        var labelY2 = this.longitude + this.radius + (60 + this.radius / 2)
                            * Math.sin(start_angle + slice_angle / 2);
                        drawLine(ctx, labelX, labelY, labelX2, labelY2);
                        drawLine(ctx, labelX2, labelY2, this.latitude - 10, labelY2);
                        labelX = this.latitude - 10 - 30;
                        labelY = labelY2;
                    }
                    else {
                        labelX -= 12;
                    }
                }
                else {
                    if (width < 3.1) {
                        var labelX2 = this.latitude + this.radius + (60 + this.radius / 2)
                    * Math.cos(start_angle + slice_angle / 2);
                        var labelY2 = this.longitude + this.radius + (60 + this.radius / 2)
                            * Math.sin(start_angle + slice_angle / 2);
                        drawLine(ctx, labelX, labelY, labelX2, labelY2);
                        drawLine(ctx, labelX2, labelY2, this.latitude + this.radius * 2 + 10, labelY2);
                        labelX = this.latitude + this.radius * 2 + 10;
                        labelY = labelY2;
                    }
                }
                if (labelY > this.radius + this.longitude) {
                    labelY += 12;
                }
                var labelText = Math.round((percent * 100) * 10) / 10 + "%";
                drawText(ctx, labelX, labelY, labelText, "black", "bold 12px Arial", 30);

                //drawLine(this.ctx, labelX, labelY, labelX + 10, labelY + 10)

                //repare for new loop
                start_angle += slice_angle;
                color_index++;
            }

            //drawing a white circle over the chart to create the donut chart
            drawPieSlice(
                this.ctx,
                this.radius + this.latitude,
                this.radius + this.longitude,
                this.options.donutHoleSize * Math.min(this.radius, this.radius),
                0,
                2 * Math.PI,
                "#ffffff"
            );
            //draw note
            var indexColor = 0;
            var noteX = this.latitude + this.radius * 2 + 100;
            var noteY = this.longitude + this.radius / 1.5;
            for (var rank in rankValues) {
                drawRectangle(ctx, noteX, noteY, 10, 10, colors[indexColor++]);
                console.log(rankValues);
                drawText(ctx, noteX + 20, noteY + 10, rank, "black", "bold 12px Arial", 100);
                noteY += 25;
            }
        }
    }
    //render excute donut chart
    function renderDonut(renderId, dataInput) {
        var myCanvas = document.getElementById(renderId);
        myCanvas.width = 500;
        myCanvas.height = 500;

        ctx = myCanvas.getContext("2d");
        colors = dataInput.colors;
        rankValues = dataInput.RankValues;

        var myDougnutChart = new Doughnutchart({
            ctx: ctx,
            colors: colors,
            donutHoleSize: 0.5,
            radiusDonut: 100,
            latitudeDonut: 100,
            longitudeDonut: 100
        });
        myDougnutChart.draw();
    }
    return {
        renderDonut: renderDonut
    }
}();
