set.seed(5)
> x    <- 1:100
> y    <- 0.1*x^2 + 0.2*x - 300 + rnorm(100, sd=100)
> red  <- (y - min(y)) / (max(y) - min(y))
> 
> png("cex-default.png")
> main <- "par(cex.axis=1, cex.lab=1, cex.main=1.2, cex.sub=1)"
> plot(x, y, col=rgb(red, 0.5, 0.25, 0.8), cex=2,
+      pch=19, xlab="x-axis label", ylab="y-axis label",
+      main=main)
> title(sub="subtitle")
> dev.off()
null device 
          1 
> 
> png("cex-axis.png")
> par(cex.axis=2, cex.lab=1, cex.main=1.2, cex.sub=1)
> main <- "par(cex.axis=2, cex.lab=1, cex.main=1.2, cex.sub=1)"
> plot(x, y, col=rgb(red, 0.5, 0.25, 0.8), cex=2,
+      pch=19, xlab="x-axis label", ylab="y-axis label",
+      main=main)
> title(sub="subtitle")
> dev.off()
null device 
          1 
> 

> png("cex-lab.png")
> par(cex.axis=1, cex.lab=2, cex.main=1.2, cex.sub=1)
> main <- "par(cex.axis=1, cex.lab=2, cex.main=1.2, cex.sub=1)"
> plot(x, y, col=rgb(red, 0.5, 0.25, 0.8), cex=2,
+      pch=19, xlab="x-axis label", ylab="y-axis label",
+      main=main)
> title(sub="subtitle")
> dev.off()
null device 
          1 
> 
> png("cex-main.png")
> par(cex.axis=1, cex.lab=1, cex.main=2, cex.sub=1)
> main <- "par(cex.axis=1, cex.lab=1, cex.main=2, cex.sub=1)"
> plot(x, y, col=rgb(red, 0.5, 0.25, 0.8), cex=2,
+      pch=19, xlab="x-axis label", ylab="y-axis label",
+      main=main)
> title("", sub="subtitle")
> dev.off()
null device 
          1 
> 
> png("cex-sub.png")
> par(cex.axis=1, cex.lab=1, cex.main=1.2, cex.sub=2)
> main <- "par(cex.axis=1, cex.lab=1, cex.main=1.2, cex.sub=2)"
> plot(x, y, col=rgb(red, 0.5, 0.25, 0.8), cex=2,
+      pch=19, xlab="x-axis label", ylab="y-axis label",
+      main=main)
> title(sub="subtitle")
> dev.off()
null device 
          1 





windowsFonts(
  A=windowsFont("Arial Black"),
  B=windowsFont("Bookman Old Style"),
  C=windowsFont("Comic Sans MS"),
  D=windowsFont("Symbol"),
  E=windowsFont("Helvetica")
)


#text(4,4,family="A","Hello World from Arial Black")







par(mar = c(3,2,2,1))

par(mar = c(low, left, top, right)) - margins of the graph area.

title("text" - title text
      adj  = from left (0) to right (1) with anything in between: 0.1, 0.2, etc...
      line = positive values move title text up, negative - down)