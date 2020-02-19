from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .forms import CoordinatesForm
from processor.CoordinateProcessor import Coordinate

# Create your views here.


def index(request):
    return render(request, 'poll/index.html')


def newpoll(request):
    return render(request, 'poll/newpoll.html')


def pollpost(request):
    if request.method == 'POST':
        print("POST LOGICAL AREA")
        form = CoordinatesForm(request.POST)
        fromCoord = request.POST.get('from_input')
        toCoord = request.POST.get('to_input')
        coordinate = Coordinate(fromCoord, toCoord)
        coordinate.writeData()
    else:
        print("NON-POST LOGICAL AREA")
        form = CoordinatesForm()

    print("SHARED LOGICAL AREA")

    return render(request, 'poll/index.html', {'form': form})


def viewpoll(request):
    return render(request, 'poll/viewpoll.html')

def busdata(request):
    file = open("F:/PUBLIC/Project/Molit_Hackathon2018/RoutePoll/ServerDatabase/BusPath.csv")
    return file