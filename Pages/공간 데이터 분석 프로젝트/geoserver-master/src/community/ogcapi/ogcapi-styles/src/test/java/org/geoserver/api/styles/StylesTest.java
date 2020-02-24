/* (c) 2019 Open Source Geospatial Foundation - all rights reserved
 * This code is licensed under the GPL 2.0 license, available at the root
 * application directory.
 */
package org.geoserver.api.styles;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;

import com.jayway.jsonpath.DocumentContext;
import java.util.List;
import org.hamcrest.Matchers;
import org.jsoup.nodes.Document;
import org.junit.Test;

public class StylesTest extends StylesTestSupport {

    @Test
    public void testStylesHTML() throws Exception {
        Document document = getAsJSoup("ogc/styles/styles?f=html");
    }

    @Test
    public void testStylesJson() throws Exception {
        DocumentContext json = getAsJSONPath("ogc/styles/styles", 200);
        testStylesJson(json);
    }

    private void testStylesJson(DocumentContext json) {
        // check the self link
        assertEquals("self", readSingle(json, "links[?(@.type == 'application/json')].rel"));
        // and the alternates
        assertEquals("alternate", readSingle(json, "links[?(@.type == 'application/x-yaml')].rel"));

        // check all the styles are there
        assertThat(
                ((List<String>) json.read("styles[*].id")),
                Matchers.containsInAnyOrder(
                        "point",
                        "line",
                        "polygon",
                        "raster",
                        "generic",
                        "Default",
                        "ws:NamedPlaces",
                        "PolygonComment",
                        "cssSample",
                        "Lakes",
                        "Buildings"));

        // concentrate on one and check title and links
        assertEquals("Default Styler", readSingle(json, "styles[?(@.id == 'Default')].title"));
        // can encode sld 1.0
        assertEquals(
                "http://localhost:8080/geoserver/ogc/styles/styles/Default?f=application%2Fvnd.ogc.sld%2Bxml",
                readSingle(
                        json,
                        "styles[?(@.id == 'Default')].links[?(@.rel == 'stylesheet' && @.type == 'application/vnd.ogc.sld+xml')].href"));
        // but not css, cannot go from css to sld at the moment
        assertFalse(
                exists(
                        json,
                        "styles[?(@.id == 'Default')].links[?(@.rel == 'stylesheet' && @.type == 'application/vnd.geoserver.geocss+css')]"));
    }
}
