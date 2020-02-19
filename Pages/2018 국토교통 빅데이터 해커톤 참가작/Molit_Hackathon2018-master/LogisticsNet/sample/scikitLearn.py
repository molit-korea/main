import sklearn
from sklearn import metrics

X = [0, 1, 6, 7, 10, 13, 12]
Y = [6, 6, 3, 5, 8, 9, 1]

x = [[7, 6, 1]]
y = [[2, 2, 1]]

mse = metrics.mean_squared_error(X, Y)
euclideanDistance = metrics.euclidean_distances(x, y)
print("MSE : ", mse)
print("Euclidean Distance : ", euclideanDistance)