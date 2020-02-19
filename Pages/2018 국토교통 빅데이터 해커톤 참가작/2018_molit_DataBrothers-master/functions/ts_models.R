run_arima_novalid <- function(price, rest_loc, rest_forc_len,
				     freq=12, level=c(80,95), log=FALSE){

#price <- tar_ts
#rest_forc_len <- 3
#freq = 12
#log <- 1
#rest_loc <- '¼­¿ï'

# log
if (log==1){
price$c_value <- log(price$c_value)
}

# arima
if (length(price$c_date)<12){
ts_price <- tsclean(ts(price$c_value))
} else{
ts_price <- tsclean(ts(price$c_value, frequency = freq))
}

#ts_price
arima.fit <- auto.arima(ts_price, stepwise = TRUE, approximation = TRUE)
arima_price <- arima.fit %>% forecast(h = rest_forc_len, level = level)
arima_price %>% autoplot

# create table
table_1 <- price %>%
	mutate(ARIMA = as.numeric(arima_price$fitted))

yr <- year(max(price$c_date))
mon <- month(max(price$c_date))+1
if (mon==13){
mon <- 1
yr <- yr+1
}
day <- day(max(price$c_date))
start_date <- as.Date(sprintf("%d-%d-%d", yr, mon, day))

end_yr <- yr
end_mon <- mon+rest_forc_len-1
if (end_mon > 12){
end_yr <- end_yr+end_mon%/%12
end_mon <- end_mon%%12
}
end_date <- as.Date(sprintf("%d-%d-%d", end_yr, end_mon, day))
forc_date <- seq(start_date, end_date, by = 'month')

table_2 <- data.frame(arima_price) %>%
	mutate(c_date = forc_date,
		 c_loc = rest_loc,
		 c_model = "ARIMA") %>%
	select(c_date = c_date,
		 c_loc = c_loc,
		 c_model = c_model,
		 c_forecast = Point.Forecast,
		 low80 = Lo.80,
		 hi80 = Hi.80,
		 low95 = Lo.95,
		 hi95 = Hi.95)

test <- Box.test(arima_price$residual, lag=1, type="Ljung")
p_val_ARIMA <- test[3]$p.value

table_3 <- tibble(c_loc = rest_loc,
			is_na = sum(price$is_na),
			ARIMA = p_val_ARIMA)



table_4 <- tibble(c_loc = rest_loc,
	p = arima.fit$arma[1], 
	d = arima.fit$arma[6],
	q = arima.fit$arma[2],
	P = arima.fit$arma[3],
	D = arima.fit$arma[7],
	Q = arima.fit$arma[4])


if (log==1){
table_1 <- table_1 %>%
	mutate(c_value = exp(c_value),
		 ARIMA = exp(ARIMA))
table_2 <- table_2 %>%
	mutate(c_forecast = exp(c_forecast),
		 low80 = exp(low80),
		 hi80 = exp(hi80),
		 low95 = exp(low95),
		 hi95 = exp(hi95))

colnames(table_2)[5] <- paste('low', level[1], sep='')
colnames(table_2)[6] <- paste('hi', level[1], sep='')
colnames(table_2)[7] <- paste('low', level[2], sep='')
colnames(table_2)[8] <- paste('hi', level[2], sep='')
}

return(list(table_1, table_2, table_3, table_4))

}



#########################################################

run_prophet_novalid <- function(price, rest_loc, rest_forc_len,
					  level=c(80,95), log=FALSE){

# log
if (log==1){
price$c_value <- log(price$c_value)
}


ts_price <- price %>%
	select(ds = c_date,
		 y = c_value)

proph.fit <- prophet(ts_price, changepoint.prior.scale=0.05,
                      yearly.seasonality = 'auto',
                      weekly.seasonality = FALSE,
                      daily.seasonality = FALSE,
			    interval.width = 0.80,
			    mcmc.samples = 0)

proph.future <- make_future_dataframe(proph.fit, periods = rest_forc_len, freq = 'month')
proph.fcast <- predict(proph.fit, proph.future)

#plot(proph.fit, proph.fcast)
#prophet_plot_components(proph.fit, proph.fcast)

proph.hist <- proph.fcast %>% filter(ds <= max(price$c_date))
proph.forc <- proph.fcast %>% filter(ds > max(price$c_date))

table_1 <- price %>%
	mutate(Prophet = proph.hist$yhat)

table_2 <- proph.forc %>%
	mutate(c_date = ds,
		 c_loc = rest_loc,
		 c_model = "Prophet") %>%
	select(c_date = c_date,
		 c_loc = c_loc,
		 c_model = c_model,
		 c_forecast = yhat,
		 low80 = yhat_lower,
		 hi80 = yhat_upper)

table_4 <- proph.fcast %>%
	mutate(c_date = ds,
		 c_loc = rest_loc,
		 c_model = "Prophet") %>%
	select(c_date = c_date,
		 c_loc = c_loc,
		 c_model = c_model,
		 c_forecast = yhat,
		 low80 = yhat_lower,
		 hi80 = yhat_upper)

proph.fit <- prophet(ts_price, changepoint.prior.scale=0.05,
                      yearly.seasonality = 'auto',
                      weekly.seasonality = FALSE,
                      daily.seasonality = FALSE,
			    interval.width = 0.95,
			    mcmc.samples = 0)

proph.future <- make_future_dataframe(proph.fit, periods = rest_forc_len, freq = 'month')
proph.fcast <- predict(proph.fit, proph.future)
proph.forc <- proph.fcast %>% filter(ds > max(price$c_date))

table_2 <- table_2 %>%
	mutate(low95 = proph.forc$yhat_lower,
		 hi95 = proph.forc$yhat_upper)

table_4 <- table_4 %>%
	mutate(low95 = proph.fcast$yhat_lower,
		 hi95 = proph.fcast$yhat_upper)


#test <- t.test(exp(table_1$c_value),exp(table_1$Prophet))
test <- Box.test(table_1$c_value-table_1$Prophet, lag=1, type="Ljung")
p_val_Prophet <- test$p.value

table_3 <- tibble(c_loc = rest_loc,
			is_na = sum(price$is_na),
			Prophet = p_val_Prophet)


if (log==1){
table_1 <- table_1 %>%
	mutate(c_value = exp(c_value),
		 Prophet = exp(Prophet))
table_2 <- table_2 %>%
	mutate(c_forecast = exp(c_forecast),
		 low80 = exp(low80),
		 hi80 = exp(hi80),
		 low95 = exp(low95),
		 hi95 = exp(hi95))
table_4 <- table_4 %>%
	mutate(c_forecast = exp(c_forecast),
		 low80 = exp(low80),
		 hi80 = exp(hi80),
		 low95 = exp(low95),
		 hi95 = exp(hi95))

colnames(table_2)[5] <- paste('low', level[1], sep='')
colnames(table_2)[6] <- paste('hi', level[1], sep='')
colnames(table_2)[7] <- paste('low', level[2], sep='')
colnames(table_2)[8] <- paste('hi', level[2], sep='')

colnames(table_4)[5] <- paste('low', level[1], sep='')
colnames(table_4)[6] <- paste('hi', level[1], sep='')
colnames(table_4)[7] <- paste('low', level[2], sep='')
colnames(table_4)[8] <- paste('hi', level[2], sep='')
}


return(list(table_1, table_2, table_3, table_4))

}


#########################################################


run_holtwinter_novalid <- function(price, rest_loc, rest_forc_len,
					    level=c(80,95), log=FALSE){

# log
if (log==1){
price$c_value <- log(price$c_value)
}

# forecast vector
yr <- year(max(price$c_date))
mon <- month(max(price$c_date))+1
if (mon==13){
mon <- 1
yr <- yr+1
}
day <- day(max(price$c_date))
start_date <- as.Date(sprintf("%d-%d-%d", yr, mon, day))

end_yr <- yr
end_mon <- mon+rest_forc_len-1
if (end_mon > 12){
end_yr <- end_yr+end_mon%/%12
end_mon <- end_mon%%12
}
end_date <- as.Date(sprintf("%d-%d-%d", end_yr, end_mon, day))
forc_date <- seq(start_date, end_date, by = 'month')

# run holtwinter
ts_price <- tsclean(ts(price$c_value, frequency = 12))
hw.fit <- HoltWinters(ts_price)
hw_price <- predict(hw.fit, n.ahead = rest_forc_len, prediction.interval = T, level = 0.80) %>%
	as.tibble() %>%
	mutate(c_date = forc_date,
		 c_loc = rest_loc,
		 c_model = "HoltWinter") %>%
	select(c_date = c_date,
		 c_loc = c_loc,
		 c_model = c_model,
		 c_forecast = fit,
		 low80 = lwr,
		 hi80 = upr)

# create table
hw_hist <- as.tibble(hw.fit$fitted)
len_na <- length(ts_price)-length(hw_hist$xhat)

if (log==1){
hw_xhat_exp <- exp(hw_hist$xhat)
}

hw_hist_vec <- as.vector(c(matrix(0,nrow=len_na),hw_xhat_exp))

table_1 <- price %>%
	mutate(HoltWinter = hw_hist_vec)

table_2 <- hw_price
hw_price <- predict(hw.fit, n.ahead = rest_forc_len, prediction.interval = T, level = 0.95) %>%
	as.tibble()
table_2 <- table_2 %>%
	mutate(low95 = hw_price$lwr,
		 hi95 = hw_price$upr)

v1 <- table_1$c_value[len_na+1:length(table_1$c_value)]
v2 <- table_1$HoltWinter[len_na+1:length(table_1$c_value)]
#test <- t.test(exp(v1), exp(v2))
test <- Box.test(v1-v2, lag=1, type="Ljung")
p_val_hw <- test$p.value

table_3 <- tibble(c_loc = rest_loc,
			is_na = sum(price$is_na),
			HoltWinter = p_val_hw)


if (log==1){
table_1 <- table_1 %>%
	mutate(c_value = exp(c_value))
table_2 <- table_2 %>%
	mutate(c_forecast = exp(c_forecast),
		 low80 = exp(low80),
		 hi80 = exp(hi80),
		 low95 = exp(low95),
		 hi95 = exp(hi95))

colnames(table_2)[5] <- paste('low', level[1], sep='')
colnames(table_2)[6] <- paste('hi', level[1], sep='')
colnames(table_2)[7] <- paste('low', level[2], sep='')
colnames(table_2)[8] <- paste('hi', level[2], sep='')
}


return(list(table_1, table_2, table_3))
}



#########################################################

run_mlm_novalid <- function(price, rest_loc, rest_forc_len,
				    level=c(80,95), log=FALSE){

# log
if (log==1){
price$c_value <- log(price$c_value)
}

ts_price <- price %>%
		select(c_date = c_date,
			 c_value = c_value)


# Augment (adds data frame columns)
ts_price_aug <- ts_price %>%
  tk_augment_timeseries_signature()
#ts_price_aug

# linear regression model used, but can use any model
fit_lm <- lm(c_value ~ ., data = select(ts_price_aug, -c(c_date, diff)))
#summary(fit_lm)

# Make historical index
hist_idx <- ts_price %>%
  tk_index()
hist_data_tbl <- hist_idx %>%
  tk_get_timeseries_signature()

# Make future index
future_idx <- hist_idx %>%
  tk_make_future_timeseries(n_future = rest_forc_len)
future_data_tbl <- future_idx %>%
  tk_get_timeseries_signature()

# predictions
pred <- predict(fit_lm, newdata = select(hist_data_tbl, -c(index, diff)))
fcast <- predict(fit_lm, newdata = select(future_data_tbl, -c(index, diff)))

pred_tbl <- tibble(c_date = hist_idx, c_value = pred)
fcast_tbl <- tibble(c_date  = future_idx, c_forecast = fcast)

# create table
table_1 <- price %>%
	mutate(MLM = pred_tbl$c_value)

table_2 <- fcast_tbl %>%
	mutate(c_loc = rest_loc,
		 c_model = "MLM",
		 low80 = -9999,
		 hi80 = -9999,
		 low95 = -9999,
		 hi95 = -9999) %>%
	select(c_date = c_date,
		 c_loc = c_loc,
		 c_model = c_model,
		 c_forecast = c_forecast,
		 low80 = low80,
		 hi80 = hi80,
		 low95 = low95,
		 hi95 = hi95)

#test <- t.test(exp(table_1$c_value), exp(table_1$MLM))
test <- Box.test(table_1$c_value-table_1$MLM, lag=1, type="Ljung")
p_val_MLM <- test$p.value

table_3 <- tibble(c_loc = rest_loc,
			is_na = sum(price$is_na),
			MLM = p_val_MLM)



if (log==1){
table_1 <- table_1 %>%
	mutate(c_value = exp(c_value),
		 MLM = exp(MLM))
table_2 <- table_2 %>%
	mutate(c_forecast = exp(c_forecast))

colnames(table_2)[5] <- paste('low', level[1], sep='')
colnames(table_2)[6] <- paste('hi', level[1], sep='')
colnames(table_2)[7] <- paste('low', level[2], sep='')
colnames(table_2)[8] <- paste('hi', level[2], sep='')
}


return(list(table_1, table_2, table_3))


}



