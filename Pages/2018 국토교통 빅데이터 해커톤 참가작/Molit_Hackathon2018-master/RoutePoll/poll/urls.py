from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('newpoll', views.newpoll, name='newpoll'),
    path('viewpoll', views.viewpoll, name='viewpoll'),
    path('pollpost', views.pollpost, name='pollpost'),
    path('busdata', views.busdata, name='busdata'),
]