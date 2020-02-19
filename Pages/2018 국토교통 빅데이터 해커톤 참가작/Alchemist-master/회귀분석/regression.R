fi1 <- read.csv("yd.csv")
head(fi1)

summary(fi1)
View(fi1)

fi1.glm <- glm(fi1$가격상승률~., data=fi1[,2:31])
step(fi1.glm)
fi1.lm <- lm(formula = fi1$가격상승률 ~ 주민등록인구 + 세대수 + 총전출수 + 보육시설수 + 의료기관수 + 주차면수 + 지방세액 + 교육시설수 + 학원수 + 외국인비율 + 평균연령 + 인구밀도 + X1인당공무원수 + X1인가구비율 + 장애인비율, data = fi1[, 2:31])


summary(fi1.lm)
