<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
	xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
	xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" 
	xmlns:xlink="http://www.w3.org/1999/xlink" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <UserStyle>
        <Name>Default Styler</Name>
        <Title>Default Styler</Title>
        <Abstract></Abstract>
        <FeatureTypeStyle>
            <FeatureTypeName>Streams</FeatureTypeName>
            <Rule>
                <Name>A Blue line with width of 2 pixels and dashed stroke</Name>
                <Abstract>Dashed Blue Line</Abstract>
                <Title>Dashed Blue Line</Title>
                <LineSymbolizer>
                    <Stroke>
                        <CssParameter name="stroke">
                            <ogc:Literal>#4040C0</ogc:Literal>
                        </CssParameter>
                        <CssParameter name="stroke-linecap">
                            <ogc:Literal>butt</ogc:Literal>
                        </CssParameter>
                        <CssParameter name="stroke-linejoin">
                            <ogc:Literal>miter</ogc:Literal>
                        </CssParameter>
                        <CssParameter name="stroke-opacity">
                            <ogc:Literal>1</ogc:Literal>
                        </CssParameter>
                        <CssParameter name="stroke-width">
                            <ogc:Literal>2</ogc:Literal>
                        </CssParameter>
                        <CssParameter name="stroke-dashoffset">
                            <ogc:Literal>0</ogc:Literal>
                        </CssParameter>
                    </Stroke>
                </LineSymbolizer>
            </Rule>
        </FeatureTypeStyle>
    </UserStyle>
</StyledLayerDescriptor>
