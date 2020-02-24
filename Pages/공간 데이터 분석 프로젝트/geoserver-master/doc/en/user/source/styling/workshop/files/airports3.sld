<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
 xmlns="http://www.opengis.net/sld"
 xmlns:ogc="http://www.opengis.net/ogc"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>airports</Name>
    <UserStyle>
      <Title>Airports</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>airports</Name>
          <Title>Airports</Title>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                xlink:href="airport.svg" />
                <Format>image/svg</Format>
              </ExternalGraphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple"
                xlink:href="airport.png" />
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>16</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>