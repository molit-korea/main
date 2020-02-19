output_jongno_morning_graph = open('output_jongno_morning_graph', 'w')
output_jongno_morning_map = open('output_jongno_morning_map', 'w')

output_sungshin_morning_map = open('output_sungshin_morning_map', 'w')
output_sungshin_morning_graph = open('output_sungshin_morning_graph', 'w')

output_sincheon_morning_map = open('output_sincheon_morning_map', 'w')
output_sincheon_morning_graph = open('output_sincheon_morning_graph', 'w')

output_kunkuk_morning_map = open('output_kunkuk_morning_map', 'w')
output_kunkuk_morning_graph = open('output_kunkuk_morning_graph', 'w')


# location jongno     -> jn
# location ku         -> ku
# location sungshin -> ss
# location shinchen -> sc

# time morning  m 0700 ~ 0930
# time evening  e 1630 ~ 1930
# time night    n 2200 ~ 2359
#
#
#  -> o_lo_ti

import numpy as np
import gzip
# import re

global_dict = {}
global_array = {}
global_car_count = [[0] * 55 for i in range(1,56)]




def location(t) :
    c = 0
#    print("t : ",t)
    for i in range(t.__len__()-1,0,-1) :
        if t[i] == '|' :
            c = c + 1
            if c == 9 :
                x = t[i+1:i+10]
            elif c == 10 :
                y = t[i+1:i+10]
                break
    return (int(x), int(y))

def jongno(yy, xx, cid, time) :

    if 37564506 <= yy and yy <= 37571301 and 126975846 <= xx and xx <= 127002984 : # in Jongno block
#        output_jongno_morning_map.write(str(cid)+" "+str(yy)+" "+str(xx)+" "+str(time)+"\n")
        return 2
        if 37570118 <= yy and yy <= 37571496 and 126977084 <= xx and xx <= 126977227 : # 1 -> 2
            calculate_node(1, 2, cid, xx, yy, time)
            return 1
        elif 37570144 <= yy and yy <= 37570365 and 126979208 <= xx and xx <= 126979372 :         # 7 -> 8
            calculate_node(7,8, cid, xx, yy, time)
            return 1
        elif 37570138 <= yy and yy <= 37571320 and 126982856 <= xx and xx <= 126983106 :        # 14 -> 15
            calculate_node(14,15, cid, xx, yy, time)
            return 1
        elif 37570193 <= yy and yy <= 37571094 and 126987565 <= xx and xx <= 126987708 :        # 24 -> 25
            calculate_node(24,25, cid, xx, yy, time)
            return 1
        elif 37570270 <= yy and yy <= 37571256 and 126989185 <= xx and xx <= 126989467 :         # 30 -> 31
            calculate_node(30,31, cid, xx, yy, time)
            return 1
        elif 37570406 <= yy and yy <= 37571180 and 126991878 <= xx and xx <= 126992150 :         # 34 -> 35
            calculate_node(34,35, cid, xx, yy, time)
            return 1
        elif 37570692 <= yy and yy <= 37571534 and 126997611 <= xx and xx <= 126997765 :         # 40 -> 41
            calculate_node(40,41, cid, xx, yy, time)
            return 1
        elif 37570948 <= yy and yy <= 37571645 and 127001871 <= xx and xx <= 127001992 :         # 46 -> 47
            calculate_node(46,47, cid, xx, yy, time)
            return 1
        elif 37569166 <= yy and yy <= 37570118 and 126977127 <= xx and xx <= 126977281 :         # 2 -> 3
            calculate_node(2,3, cid, xx, yy, time)
            return 1
        elif 37570118 <= yy and yy <= 37570144 and 126977127 <= xx and xx <= 126979372 :         # 2 -> 8
            calculate_node(2,8, cid, xx, yy, time)
            return 1
        elif 37569123 <= yy and yy <= 37570144 and 126979197 <= xx and xx <= 126979372 :         # 8 -> 9
            calculate_node(8,9, cid, xx, yy, time)
            return 1
        elif 37570138 <= yy and yy <= 37570144 and 126979272 <= xx and xx <= 126982956 :         # 8 -> 15
            calculate_node(8,15, cid, xx, yy, time)
            return 1
        elif 37568845 <= yy and yy <= 37570138 and 126982684 <= xx and xx <= 126982956 :         # 15 -> 16
            calculate_node(15,16, cid, xx, yy, time)
            return 1
        elif 37570138 <= yy and yy <= 37570193 and 126982856 <= xx and xx <= 126987708 :         # 15 -> 25
            calculate_node(15,25, cid, xx, yy, time)
            return 1
        elif 37568084 <= yy and yy <= 37570193 and 126987565 <= xx and xx <= 126987708 :         # 25 -> 26
            calculate_node(25,26, cid, xx, yy, time)
            return 1
        elif 37570193 <= yy and yy <= 37570270 and 126987608 <= xx and xx <= 126989467 :         # 25 -> 31
            calculate_node(25,31, cid, xx, yy, time)
            return 1
        elif 37570270 <= yy and yy <= 37570406 and 126989367 <= xx and xx <= 126992150 :        # 31 -> 35
            calculate_node(31,35, cid, xx, yy, time)
            return 1
        elif 37568365 <= yy and yy <= 37570406 and 126992050 <= xx and xx <= 126992418 :         # 35 -> 36
            calculate_node(35,36, cid, xx, yy, time)
            return 1
        elif 37570406 <= yy and yy <= 37570692 and 126992050 <= xx and xx <= 126997765 :         # 35 -> 41
            calculate_node(35,41, cid, xx, yy, time)
            return 1
        elif 37568813 <= yy and yy <= 37570692 and 126997665 <= xx and xx <= 126997969 :         # 41 -> 42
            calculate_node(41,42, cid, xx, yy, time)
            return 1
        elif 37570692 <= yy and yy <= 37570948 and 126997665 <= xx and xx <= 127001971 :         # 41 -> 47
            calculate_node(41,47, cid, xx, yy, time)
            return 1
        elif 37569596 <= yy and yy <= 37570948 and 127001871 <= xx and xx <= 127002057 :         # 47 -> 48
            calculate_node(47,48, cid, xx, yy, time)
            return 1
        elif 37566989 <= yy and yy <= 37569166 and 126977181 <= xx and xx <= 126977356 :        # 3 -> 4
            calculate_node(3,4, cid, xx, yy, time)
            return 1
        elif 37569123 <= yy and yy <= 37569166 and 126977181 <= xx and xx <= 126979297 :        # 3 -> 9
            calculate_node(3,9, cid, xx, yy, time)
            return 1
        elif 37566937 <= yy and yy <= 37569123 and 126979111 <= xx and xx <= 126979297 :        # 9 -> 10
            calculate_node(9,10, cid, xx, yy, time)
            return 1
        elif 37568845 <= yy and yy <= 37569123 and 126979197 <= xx and xx <= 126982784 :        # 9 -> 16
            calculate_node(9,16, cid, xx, yy, time)
            return 1
        elif 37566693 <= yy and yy <= 37568845 and 126982587 <= xx and xx <= 126982784 :        # 16 -> 17
            calculate_node(16,17, cid, xx, yy, time)
            return 1
        elif 37568088 <= yy and yy <= 37568845 and 126982684 <= xx and xx <= 126985831 :        # 16 -> 20
            calculate_node(16,20, cid, xx, yy, time)
            return 1
        elif 37566761 <= yy and yy <= 37568088 and 126985688 <= xx and xx <= 126985831 :        # 20 -> 21
            calculate_node(20,21, cid, xx, yy, time)
            return 1
        elif 37568084 <= yy and yy <= 37568088 and 126985731 <= xx and xx <= 126987665 :        # 20 -> 26
            calculate_node(20,26, cid, xx, yy, time)
            return 1
        elif 37566128 <= yy and yy <= 37568084 and 126987479 <= xx and xx <= 126987665 :        # 26 -> 27
            calculate_node(26,27, cid, xx, yy, time)
            return 1
        elif 37568084 <= yy and yy <= 37568365 and 126987565 <= xx and xx <= 126992418 :        # 26 -> 36
            calculate_node(26,36, cid, xx, yy, time)
            return 1
        elif 37566333 <= yy and yy <= 37568365 and 126992318 <= xx and xx <= 126992633 :        # 36 -> 37
            calculate_node(36,37, cid, xx, yy, time)
            return 1
        elif 37568365 <= yy and yy <= 37568813 and 126992318 <= xx and xx <= 126997969 :        # 36 -> 42
            calculate_node(36,42, cid, xx, yy, time)
            return 1
        elif 37566602 <= yy and yy <= 37568813 and 126997869 <= xx and xx <= 126998173 :        # 42 -> 43
            calculate_node(42,43, cid, xx, yy, time)
            return 1
        elif 37568813 <= yy and yy <= 37569596 and 126997869 <= xx and xx <= 127002057 :        # 42 -> 48
            calculate_node(42,48, cid, xx, yy, time)
            return 1
        elif 37566815 <= yy and yy <= 37569596 and 127001957 <= xx and xx <= 127002293 :        # 48 -> 49
            calculate_node(48,49, cid, xx, yy, time)
            return 1
        elif 37564888 <= yy and yy <= 37566989 and 126977213 <= xx and xx <= 126977356 :        # 4 -> 5
            calculate_node(4,5, cid, xx, yy, time)
            return 1
        elif 37566937 <= yy and yy <= 37566989 and 126977256 <= xx and xx <= 126979211 :        # 4 -> 10
            calculate_node(4,10, cid, xx, yy, time)
            return 1
        elif 37565933 <= yy and yy <= 37566937 and 126979004 <= xx and xx <= 126979211 :        # 10 -> 11
            calculate_node(10,11, cid, xx, yy, time)
            return 1
        elif 37565987 <= yy and yy <= 37566693 and 126982566 <= xx and xx <= 126982687 :        # 17 -> 18
            calculate_node(17,18, cid, xx, yy, time)
            return 1
        elif 37566693 <= yy and yy <= 37566761 and 126982587 <= xx and xx <= 126985788 :        # 17 -> 21
            calculate_node(17,21, cid, xx, yy, time)
            return 1
        elif 37566055 <= yy and yy <= 37566761 and 126985656 <= xx and xx <= 126985788 :        # 21 -> 22
            calculate_node(21,22, cid, xx, yy, time)
            return 1
        elif 37564895 <= yy and yy <= 37565933 and 126978446 <= xx and xx <= 126979104 :        # 11 -> 12
            calculate_node(11,12, cid, xx, yy, time)
            return 1
        elif 37565933 <= yy and yy <= 37565987 and 126979004 <= xx and xx <= 126982666 :        # 11 -> 18
            calculate_node(11,18, cid, xx, yy, time)
            return 1
        elif 37564142 <= yy and yy <= 37565987 and 126982158 <= xx and xx <= 126982666 :        # 18 -> 19
            calculate_node(18,19, cid, xx, yy, time)
            return 1
        elif 37565987 <= yy and yy <= 37566055 and 126982566 <= xx and xx <= 126985756 :        # 18 -> 22
            calculate_node(18,22, cid, xx, yy, time)
            return 1
        elif 37566055 <= yy and yy <= 37566128 and 126985656 <= xx and xx <= 126987579 :        # 22 -> 27
            calculate_node(22,27, cid, xx, yy, time)
            return 1
        elif 37564606 <= yy and yy <= 37566128 and 126987479 <= xx and xx <= 126987686 :        # 27 -> 28
            calculate_node(27,28, cid, xx, yy, time)
            return 1
        elif 37566128 <= yy and yy <= 37566171 and 126987479 <= xx and xx <= 126989757 :        # 27 -> 32
            calculate_node(27,32, cid, xx, yy, time)
            return 1
        elif 37564317 <= yy and yy <= 37566171 and 126989657 <= xx and xx <= 126990100 :        # 32 -> 33
            calculate_node(32,33, cid, xx, yy, time)
            return 1
        elif 37566171 <= yy and yy <= 37566333 and 126989657 <= xx and xx <= 126992633 :        # 32 -> 37
            calculate_node(32,37, cid, xx, yy, time)
            return 1
        elif 37564317 <= yy and yy <= 37566333 and 126992533 <= xx and xx <= 126992890 :        # 37 -> 38
            calculate_node(37,38, cid, xx, yy, time)
            return 1
        elif 37566333 <= yy and yy <= 37566602 and 126992533 <= xx and xx <= 126998173 :        # 37 -> 43
            calculate_node(37,43, cid, xx, yy, time)
            return 1
        elif 37564314 <= yy and yy <= 37566602 and 126998073 <= xx and xx <= 126998355 :        # 43 -> 44
            calculate_node(43,44, cid, xx, yy, time)
            return 1
        elif 37566602 <= yy and yy <= 37566815 and 126998073 <= xx and xx <= 127002293 :        # 43 -> 49
            calculate_node(43,49, cid, xx, yy, time)
            return 1
        elif 37564587 <= yy and yy <= 37566815 and 127002193 <= xx and xx <= 127002475 :        # 49 -> 50
            calculate_node(49,50, cid, xx, yy, time)
            return 1
        elif 37564218 <= yy and yy <= 37564888 and 126977004 <= xx and xx <= 126977313 :        # 5 -> 6
            calculate_node(5,6, cid, xx, yy, time)
            return 1
        elif 37564888 <= yy and yy <= 37564895 and 126977213 <= xx and xx <= 126978546 :        # 5 -> 12
            calculate_node(5,12, cid, xx, yy, time)
            return 1
        elif 37564249 <= yy and yy <= 37564895 and 126978446 <= xx and xx <= 126979136 :        # 12 -> 13
            calculate_node(12,13, cid, xx, yy, time)
            return 1
        elif 37564138 <= yy and yy <= 37564606 and 126987586 <= xx and xx <= 126987858 :        # 28 -> 29
            calculate_node(28,29, cid, xx, yy, time)
            return 1
        elif 37563977 <= yy and yy <= 37564317 and 126992790 <= xx and xx <= 126992922 :        # 38 -> 39
            calculate_node(38,39, cid, xx, yy, time)
            return 1
        elif 37563719 <= yy and yy <= 37564314 and 126998255 <= xx and xx <= 126998430 :        # 44 -> 45
            calculate_node(44,45, cid, xx, yy, time)
            return 1
        elif 37564136 <= yy and yy <= 37564587 and 127002375 <= xx and xx <= 127002518 :        # 50 -> 51
            calculate_node(50,51, cid, xx, yy, time)
            return 1
        return 2
#        print(xx, yy, cid, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#        return 2
        # 1 -> 2
        # 7 -> 8
        # 14 -> 15
        # 24 -> 25
        # 30 -> 31
        # 34 -> 35
        # 40 -> 41
        # 46 -> 47

        # 2 -> 3
        # 2 -> 8
        # 8 -> 9
        # 8 -> 15
        # 15 -> 16
        # 15 -> 25
        # 25 -> 26
        # 25 -> 31
        # 31 -> 35
        # 35 -> 36
        # 35 -> 41
        # 41 -> 42
        # 41 -> 47
        # 47 -> 48

        # 3 -> 4
        # 3 -> 9
        # 9 -> 10
        # 9 -> 16
        # 16 -> 17
        # 16 -> 20
        # 20 -> 21
        # 20 -> 26
        # 26 -> 27
        # 26 -> 36
        # 36 -> 37
        # 36 -> 42
        # 42 -> 43
        # 42 -> 48
        # 48 -> 49


        # 4 -> 5
        # 4 -> 10
        # 10 -> 11
        # 17 -> 18
        # 17 -> 21
        # 21 -> 22

        # 11 -> 12
        # 11 -> 18
        # 18 -> 19
        # 18 -> 22
        # 22 -> 27
        # 27 -> 28
        # 27 -> 32
        # 32 -> 33
        # 32 -> 37
        # 37 -> 38
        # 37 -> 43
        # 43 -> 44
        # 43 -> 49
        # 49 -> 50

        # 5 -> 6
        # 5 -> 12
        # 12 -> 13
        # 28 -> 29
        # 38 -> 39
        # 44 -> 45
        # 50 -> 51
    else :
        return 0
    # graphy

    return 0

def sungshin(yy, xx, cid) :
    if 37587210 <= yy and yy <= 37595017 and 127004635 <= xx and xx <= 127019944 : # in Sungshin block
        # 1 -> 3
        # 2 -> 3
        # 3 -> 4
        # 4 -> 6
        # 5 -> 6
        # 5 -> 7
        # 6 -> 8
        # 7 -> 8
        # 7 -> 9
        # 8 -> 10
        # 9 -> 10
        # 9 -> 11
        # 11 -> 12
        # 12 -> 15
        # 13 -> 14
        # 14 -> 15
        # 15 -> 16
        # 15 -> 17
        # 16 -> 18
        # 17 -> 21
        # 18 -> 33
        # 19 -> 20
        # 20 -> 21
        # 21 -> 22
        # 21 -> 28
        # 22 -> 23
        # 23 -> 25
        # 24 -> 26
        # 25 -> 29
        # 25 -> 33
        # 26 -> 27
        # 26 -> 29
        # 26 -> 33
        # 27 -> 32
        # 29 -> 32

        return 2
    else : return -1
    return 0

def kunkuk(yy, xx, cid, time) :
    if 37536243 <= yy and yy <= 37547594 and 127063983 <= xx and xx <= 127083580 : # in Kunkuk block
#        print("...")
        if 37542132 <= yy and yy <= 37543229 and 127060430 <= xx and xx <= 127063981 :        # 1 -> 4
            calculate_node(1,4,cid, xx, yy, time)
#            print("found one")
            return 1
        elif 37535972 <= yy and yy <= 37537189 and 127060623 <= xx and xx <= 127061170:  # 2 -> 3
            calculate_node(2,3,cid, xx, yy, time)
            return 1
        elif 37537189 <= yy and yy <= 37542132 and 127061170 <= xx and xx <= 127063981:  # 3 -> 4
            calculate_node(3,4, cid, xx, yy, time)
            return 1
        elif 37535267 <= yy and yy <= 37537189 and 127061170 <= xx and xx <= 127068429:  # 3 -> 9 ## <- 3 -> 5
            print(3, 9, cid, xx, yy, time)
            calculate_node(3, 9, cid, xx, yy, time)
            return 1
        elif 37542132 <= yy and yy <= 37547662 and 127063981 <= xx and xx <= 127067109:  # 4 -> 5
            calculate_node(4,5, cid, xx, yy, time)
            return 1
        elif 37539895 <= yy and yy <= 37542132 and 127063981 <= xx and xx <= 127070618:  # 4 -> 8
            calculate_node(4,8, cid, xx, yy, time)
            return 1
        elif 37547262 <= yy and yy <= 37547594 and 127074137 <= xx and xx <= 127074405:  # 6 -> 7
            calculate_node(6,7, cid, xx, yy, time)
            return 1
        elif 37539895 <= yy and yy <= 37547262 and 127070618 <= xx and xx <= 127074137:  # 7 -> 8
            calculate_node(7,8, cid, xx, yy, time)
            return 1
        elif 37546386 <= yy and yy <= 37547262 and 127074137 <= xx and xx <= 127076154:  # 7 -> 10
            calculate_node(7,10, cid, xx, yy, time)
            return 1
        elif 37535267 <= yy and yy <= 37539895 and 127068429 <= xx and xx <= 127070618:  # 8 -> 9
            calculate_node(8,9, cid, xx, yy, time)
            return 1
        elif 37538585 <= yy and yy <= 37539895 and 127070618 <= xx and xx <= 127075049:  # 8 -> 11
            calculate_node(8,11, cid, xx, yy, time)
            return 1
        elif 37545348 <= yy and yy <= 37546386 and 127076154 <= xx and xx <= 127080070:  # 10 -> 13
            calculate_node(10,13, cid, xx, yy, time)
            return 1
        elif 37538066 <= yy and yy <= 37538585 and 127075049 <= xx and xx <= 127077120:  # 11 -> 12
            calculate_node(11,12, cid, xx, yy, time)
            return 1
        elif 37536558 <= yy and yy <= 37538066 and 127077120 <= xx and xx <= 127083580:  # 12 -> 14
            calculate_node(12,14, cid, xx, yy, time)
            return 1
        return 2
    return 0
'''        elif 37535972 <= yy and yy <= 37537189 and 127060623 <= xx and xx <= 127061170 :      # 2 -> 3


        elif 37537189 <= yy and yy <= 37542132 and 127061170 <= xx and xx <= 127063981 :     # 3 -> 4


        elif 37535267 <= yy and yy <= 37537189 and 127061170 <= xx and xx <= 127068429 :     # 3 -> 9


        elif 37542132 <= yy and yy <= 37547662 and 127063981 <= xx and xx <= 127067109 :    # 4 -> 5


        elif 37539895 <= yy and yy <= 37542132 and 127063981 <= xx and xx <= 127070618 :     # 4 -> 8


        elif 37547262 <= yy and yy <= 37547594 and 127074137 <= xx and xx <= 127074405 :     # 6 -> 7


        elif 37539895 <= yy and yy <= 37547262 and 127070618 <= xx and xx <= 127074137 :     # 7 -> 8


        elif 37546386 <= yy and yy <= 37547262 and 127074137 <= xx and xx <= 127076154 :      # 7 -> 10


        elif 37535267 <= yy and yy <= 37539895 and 127068429 <= xx and xx <= 127070618 :      # 8 -> 9


        elif 37538585 <= yy and yy <= 37539895 and 127070618 <= xx and xx <= 127075049 :       # 8 -> 11


        elif 37545348 <= yy and yy <= 37546386 and 127076154 <= xx and xx <= 127080070 :       # 10 -> 13


        elif 37538066 <= yy and yy <= 37538585 and 127075049 <= xx and xx <= 127077120 :       # 11 -> 12


        elif 37536558 <= yy and yy <= 37538066 and 127077120 <= xx and xx <= 127083580 :      # 12 -> 14

        return 3
    return 0'''
def shincheon(yy, xx, cid) :
    if 37509461 <= yy and yy <= 37514781 and 127076416 <= xx and xx <= 127101727 : # in Shincheon block
        # 1 -> 3
        # 2 -> 3
        # 3 -> 4
        # 3 -> 7
        # 5 -> 6
        # 6 -> 7
        # 7 -> 8
        # 7 -> 10
        # 9 -> 10
        # 10 -> 11
        # 10 -> 15
        # 11 -> 12
        # 11 -> 13
        # 14 -> 15
        # 15 -> 16
        # 15 -> 17

        return 4
    return 0

def getCid(t) :
    for i in range(0,t.__len__()) :
        if t[i] == '|' :
            return t[:i]



def new_dict(newCid) :
    global global_dict
#    print(newCid)
    global_dict[newCid] = len(global_dict)
    return global_dict[newCid]

def get_dict(cid) :
    global global_dict
#    print(cid, bool(global_dict.get(cid)))
    return global_dict.get(cid)

def get_array_info(start, end, cid) : # count, x, y, time, v
    global global_array
    return (global_array[start, end, cid, 1], global_array[start, end, cid, 2], global_array[start, end, cid, 3], global_array[start, end, cid, 4], global_array[start, end, cid, 5])

def set_array_info(start, end, cid, count, xx, yy, ti, v) :
    global global_array

    global_array[start, end, cid, 1] = count + 1
    global_array[start, end, cid, 2] = xx
    global_array[start, end, cid, 3] = yy
    global_array[start, end, cid, 4] = ti
    global_array[start, end, cid, 5] = v
    print(start, end, cid, global_array[start, end, cid, 5])

def compare_previous(start, end, cid, xx, yy, ti) : # array 0: cid, 1: count, 2: x, 3: y, 4: time, 5: v

    k = get_array_info(start, end, cid)
    # count, x, y, time, v
    sx = abs(k[1]-xx)
    sy = abs(k[2]-yy)
    sx = sx * sx
    sy = sy * sy
    st = (ti - k[3])/1000
    nv = (k[0]*k[4] + (sx+sy)/st) / (k[0] + 1)

    set_array_info(start, end, cid, global_car_count[start][end], xx, yy, ti, nv)

def increment_car_count(s, e) :
#    global global_car_count
    print(s, e)
    global_car_count[s][e] = global_car_count[s][e] + 1

def calculate_node(start, end, cid, x, y, ti) : # start node, end node, read data, # using input data, calculate pre_edge_value (Cid, count, x, y, time, v)
#    global global_dict

#    cid = getCid(t)
#    xy = location(t)
#    x = xy[0]
#    y = xy[1]
#    ti = getTime(t)
    if global_car_count[start][end] == 0 :
        increment_car_count(start,end)
        set_array_info(start, end, cid, 1, x, y, ti, 0)
    else :
        compare_previous(start, end, cid, x, y, ti)

'''    if get_dict(cid)== None :
        new_dict(cid)
        increment_car_count(start, end)
        set_array_info(start, end, cid, global_car_count[start][end], x, y, ti, 0)
    else :
        d = get_dict(cid)
        compare_previous(start, end, cid, x, y, ti) # int int int int int int

    return ()'''

def getTime(t) :
    return t[-8:0]


with gzip.open('D:/DTG/0801/1/part-r-00000.gz', 'rb') as f:
    print('hell start')
    file_content = f.readline()
#    data = str(file_content)
#    data = str(data[2:-3])
#    print(getCid(data))
#    x = np.zeros((10,20,30))
#    x2 ={}
#    x2[0,0,0]=1
#    x[0,0,0]=1
#    aaa = [[]]
#    aaa[3][9] = 1
    while file_content :
        data = str(file_content)
        data = str(data[2:-3])

        time = int(data[-8:])
        file_content = f.readline()
#        output_jongno_morning_map.write("1\n")
        #break
        if 7000000 <= time and time <= 9300000 : # morning
            t = location(data)
            strcid = getCid(data)
            tcid = get_dict(strcid)
            if bool(tcid) == False :
                tcid = new_dict(strcid)
            cid = tcid
            jongno(t[0],t[1],cid,time)
'''
#            kunkuk(t[0], t[1], cid, time)
#            if kunkuk(t[0], t[1], cid) == 1:
#                print("kunkuk!")
#                break
#        elif kunkuk(t[0], t[1], cid) == 2:
#            print("kunkuk! but not :: node 1 -> node 4")
#        elif jongno(t[0], t[1], cid) == 1:
#            print("jongno")
#            break
#        elif jongno(t[0], t[1], cid) == 2:
#            print("jongno! but not .. ")
#        k = 0
#        l = data.__len__()
#        print(data)
#        print(data[-8:])
#        print(time)
        if 7000000 <= time and time <= 9300000 : # morning
            kunkuk(t[0], t[1], cid, time)
#            print('morning')
            t = location(data)
            cid = getCid(data)
#            print(data)
            if kunkuk(t[0], t[1], cid) == 1 :
                print("kunkuk!")
                break
            elif kunkuk(t[0], t[1], cid) == 2 :
                print("kunkuk! but not :: node 1 -> node 4")
            elif jongno(t[0], t[1], cid) == 1 :
                print("jongno")
                break
            elif jongno(t[0], t[1], cid) == 2 :
                print("jongno! but not .. ")
#            tt = xy(data)
#            if jongno(t[0], t[1]) == 1 :
#                print(data)
#                output_jongno_morning_map.write(data+'\n')
#            t2 = jongno(xx, yy)
        elif 16300000 <= time and time <= 19300000 : # evening
#            print('evening')
            t = location(data)
            cid = getCid(data)
#            print(data)
            if kunkuk(t[0], t[1], cid) == 1 :
                print("kunkuk!")
                break
            elif kunkuk(t[0], t[1], cid) == 2 :
                print("kunkuk! but not :: node 1 -> node 4")
            elif jongno(t[0], t[1], cid) == 1 :
                print("jongno")
                break
            elif jongno(t[0], t[1], cid) == 2 :
                print("jongno! but not .. ")
#            break
        elif 22000000 <= time and time <= 23595900 : # night
            t = location(data)
            cid = getCid(data)
            #            print(data)
            if kunkuk(t[0], t[1], cid) == 1:
                print("kunkuk!")
                break
            elif kunkuk(t[0], t[1], cid) == 2:
                print("kunkuk! but not :: node 1 -> node 4")
            elif jongno(t[0], t[1], cid) == 1:
                print("jongno")
                break
            elif jongno(t[0], t[1], cid) == 2:
                print("jongno! but not .. ")
#            print('night')
#            break
        file_content = f.readline()'''

#global global_array
#global global_car_count
for i in range(1, 13) :
    for j in range(3, 15) :
        print(i,"->",j," : ",global_car_count[i][j])
#        for k in range(1,global_car_count[i][j])
#            print("start node : ",i,"end node : ",j,"")

f.close()

output_jongno_morning_map.close()
output_jongno_morning_graph.close()

output_sungshin_morning_map.close()
output_sungshin_morning_graph.close()

output_sincheon_morning_map.close()
output_sincheon_morning_graph.close()

output_kunkuk_morning_map.close()
output_kunkuk_morning_graph.close()
