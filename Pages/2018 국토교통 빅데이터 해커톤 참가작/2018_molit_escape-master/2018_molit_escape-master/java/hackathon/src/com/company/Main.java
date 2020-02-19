package com.company;

import java.text.DecimalFormat;

public class Main {

    public static void main(String[] args) {

        //점이 몇개인가
        int vertexCount = 52;
        Vertex[] vertex = new Vertex[vertexCount];

        //길이 몇개인가
        int roadCount = 64;
        Road[] road = new Road[roadCount];

        //종로의 점들
        vertex[1] = new Vertex(37.571496, 126.977134);
        vertex[2] = new Vertex(37.570118, 126.977177);
        vertex[3] = new Vertex(37.569166, 126.977231);
        vertex[4] = new Vertex(37.566989, 126.977306);
        vertex[5] = new Vertex(37.564888, 126.977263);
        vertex[6] = new Vertex(37.564218, 126.977054);
        vertex[7] = new Vertex(37.570365, 126.979258);
        vertex[8] = new Vertex(37.570144, 126.979322);
        vertex[9] = new Vertex(37.569123, 126.979247);
        vertex[10] = new Vertex(37.566937, 126.979161);
        vertex[11] = new Vertex(37.565933, 126.979054);
        vertex[12] = new Vertex(37.564895, 126.978496);
        vertex[13] = new Vertex(37.564249, 126.979086);
        vertex[14] = new Vertex(37.57132, 126.983056);
        vertex[15] = new Vertex(37.570138, 126.982906);
        vertex[16] = new Vertex(37.568845, 126.982734);
        vertex[17] = new Vertex(37.566693, 126.982637);
        vertex[18] = new Vertex(37.565987, 126.982616);
        vertex[19] = new Vertex(37.564142, 126.982208);
        vertex[20] = new Vertex(37.568088, 126.985781);
        vertex[21] = new Vertex(37.566761, 126.985738);
        vertex[22] = new Vertex(37.566055, 126.985706);
        vertex[23] = new Vertex(37.564184, 126.986038);
        vertex[24] = new Vertex(37.571094, 126.987615);
        vertex[25] = new Vertex(37.570193, 126.987658);
        vertex[26] = new Vertex(37.568084, 126.987615);
        vertex[27] = new Vertex(37.566128, 126.987529);
        vertex[28] = new Vertex(37.564606, 126.987636);
        vertex[29] = new Vertex(37.564138, 126.987808);
        vertex[30] = new Vertex(37.571256, 126.989235);
        vertex[31] = new Vertex(37.57027, 126.989417);
        vertex[32] = new Vertex(37.566171, 126.989707);
        vertex[33] = new Vertex(37.564317, 126.99005);
        vertex[34] = new Vertex(37.57118, 126.991928);
        vertex[35] = new Vertex(37.570406, 126.9921);
        vertex[36] = new Vertex(37.568365, 126.992368);
        vertex[37] = new Vertex(37.566333, 126.992583);
        vertex[38] = new Vertex(37.564317, 126.99284);
        vertex[39] = new Vertex(37.563977, 126.992872);
        vertex[40] = new Vertex(37.571534, 126.997661);
        vertex[41] = new Vertex(37.570692, 126.997715);
        vertex[42] = new Vertex(37.568813, 126.997919);
        vertex[43] = new Vertex(37.566602, 126.998123);
        vertex[44] = new Vertex(37.564314, 126.998305);
        vertex[45] = new Vertex(37.563719, 126.99838);
        vertex[46] = new Vertex(37.571645, 127.001942);
        vertex[47] = new Vertex(37.570948, 127.001921);
        vertex[48] = new Vertex(37.569596, 127.002007);
        vertex[49] = new Vertex(37.566815, 127.002243);
        vertex[50] = new Vertex(37.564587, 127.002425);
        vertex[51] = new Vertex(37.564136, 127.002468);



        //종로 도로들의 정보
        road[0] = new Road(vertex[1 ], vertex[ 2]);
        road[1] = new Road(vertex[7 ], vertex[ 8]);
        road[2] = new Road(vertex[14], vertex[15]);
        road[3] = new Road(vertex[24], vertex[25]);
        road[4] = new Road(vertex[30], vertex[31]);
        road[5] = new Road(vertex[34], vertex[35]);
        road[6] = new Road(vertex[40], vertex[41]);
        road[7] = new Road(vertex[46], vertex[47]);
        road[8] = new Road(vertex[2 ], vertex[ 3]);
        road[9] = new Road(vertex[2 ], vertex[ 8]);
        road[10] = new Road(vertex[8 ], vertex[ 9]);
        road[11] = new Road(vertex[8 ], vertex[15]);
        road[12] = new Road(vertex[15], vertex[16]);
        road[13] = new Road(vertex[15], vertex[25]);
        road[14] = new Road(vertex[25], vertex[26]);
        road[15] = new Road(vertex[25], vertex[31]);
        road[16] = new Road(vertex[31], vertex[35]);
        road[17] = new Road(vertex[35], vertex[36]);
        road[18] = new Road(vertex[35], vertex[41]);
        road[19] = new Road(vertex[41], vertex[42]);
        road[20] = new Road(vertex[41], vertex[47]);
        road[21] = new Road(vertex[47], vertex[48]);
        road[22] = new Road(vertex[3 ], vertex[ 4]);
        road[23] = new Road(vertex[3 ], vertex[ 9]);
        road[24] = new Road(vertex[9 ], vertex[10]);
        road[25] = new Road(vertex[9 ], vertex[16]);
        road[26] = new Road(vertex[16], vertex[17]);
        road[27] = new Road(vertex[16], vertex[20]);
        road[28] = new Road(vertex[20], vertex[21]);
        road[29] = new Road(vertex[20], vertex[26]);
        road[30] = new Road(vertex[26], vertex[27]);
        road[31] = new Road(vertex[26], vertex[36]);
        road[32] = new Road(vertex[36], vertex[37]);
        road[33] = new Road(vertex[36], vertex[42]);
        road[34] = new Road(vertex[42], vertex[43]);
        road[35] = new Road(vertex[42], vertex[48]);
        road[36] = new Road(vertex[48], vertex[49]);
        road[37] = new Road(vertex[4 ], vertex[ 5]);
        road[38] = new Road(vertex[4 ], vertex[10]);
        road[39] = new Road(vertex[10], vertex[11]);
        road[40] = new Road(vertex[17], vertex[18]);
        road[41] = new Road(vertex[17], vertex[21]);
        road[42] = new Road(vertex[21], vertex[22]);
        road[43] = new Road(vertex[11], vertex[12]);
        road[44] = new Road(vertex[11], vertex[18]);
        road[45] = new Road(vertex[18], vertex[19]);
        road[46] = new Road(vertex[18], vertex[22]);
        road[47] = new Road(vertex[22], vertex[27]);
        road[48] = new Road(vertex[27], vertex[28]);
        road[49] = new Road(vertex[27], vertex[32]);
        road[50] = new Road(vertex[32], vertex[33]);
        road[51] = new Road(vertex[32], vertex[37]);
        road[52] = new Road(vertex[37], vertex[38]);
        road[53] = new Road(vertex[37], vertex[43]);
        road[54] = new Road(vertex[43], vertex[44]);
        road[55] = new Road(vertex[43], vertex[49]);
        road[56] = new Road(vertex[49], vertex[50]);
        road[57] = new Road(vertex[5 ], vertex[ 6]);
        road[58] = new Road(vertex[5 ], vertex[12]);
        road[59] = new Road(vertex[12], vertex[13]);
        road[60] = new Road(vertex[28], vertex[29]);
        road[61] = new Road(vertex[38], vertex[39]);
        road[62] = new Road(vertex[44], vertex[45]);
        road[63] = new Road(vertex[50], vertex[51]);


        for(int i=0; i<roadCount; i++){

            double maxLatitude, minLatitude;
            double maxLongitude, minLongitude;
            String returnStr;

            //위도 비교
            if(road[i].vertex1.latitude > road[i].vertex2.latitude ){
                maxLatitude = road[i].vertex1.latitude;
                minLatitude = road[i].vertex2.latitude;
            }else{
                maxLatitude = road[i].vertex2.latitude;
                minLatitude = road[i].vertex1.latitude;
            }

            //경도비교
            if(road[i].vertex1.longitude > road[i].vertex2.longitude ){
                maxLongitude = road[i].vertex1.longitude + 50;
                minLongitude = road[i].vertex2.longitude - 50;
            }else{
                maxLongitude = road[i].vertex2.longitude + 50;
                minLongitude = road[i].vertex1.longitude - 50;
            }

            DecimalFormat df = new DecimalFormat("#.#");
            double d = (double) 123456789;
            String str = df.format(d);

            returnStr = "elif " + df.format(minLatitude) + " <= yy and yy <= " + df.format(maxLatitude) +
                    " and " + df.format(minLongitude) + " <= xx and xx <= " + df.format(maxLongitude);
            System.out.println(returnStr + "\n");

        }
//        if 37564506 <= yy and yy <= 37571301 and 126975846 <= xx and xx <= 127002984



    }
}
