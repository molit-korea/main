from django import forms


class CoordinatesForm(forms.Form):
    #fromCoord = forms.CharField(label='fromCoord', max_length=100)
    #toCoord = forms.CharField(label='toCoord', max_length=100)
    fromCoord = forms.DecimalField(label='fromCoord')
    toCoord = forms.DecimalField(label='toCoord')