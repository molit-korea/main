#include<stdio.h>
#define standard 7
#define distance 2
FILE *in, *out;

int a[101][101], i, n, x, y, v, high_val[101][4], queue[3][10001], r, f;

int main() {
	in = fopen("input.txt", "r");
	out = fopen("output.txt", "w");
	fscanf(in, "%d\n", &n);
	
	for (i = 1; i <= n; i++) {
		fscanf(in, "%d %d %d", &x, &y, &v);
		a[x][y] = a[y][x] = v;
		if (v >= standard) {
			high_val[i][1] = x;
			high_val[i][1] = y;
		}
	}
	r = f = 0;
}