/* (c) 2019 Open Source Geospatial Foundation - all rights reserved
 * This code is licensed under the GPL 2.0 license, available at the root
 * application directory.
 */
package org.geoserver.api.styles;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

import com.jayway.jsonpath.DocumentContext;
import org.geoserver.api.Link;
import org.geoserver.platform.Service;
import org.geotools.util.Version;
import org.hamcrest.CoreMatchers;
import org.hamcrest.Matchers;
import org.junit.Ignore;
import org.junit.Test;
import org.w3c.dom.Document;

public class LandingPageTest extends StylesTestSupport {

    @Test
    public void testServiceDescriptor() {
        Service service = getService("Styles", new Version("1.0"));
        assertNotNull(service);
        assertEquals("Styles", service.getId());
        assertEquals(new Version("1.0"), service.getVersion());
        assertThat(service.getService(), CoreMatchers.instanceOf(StylesService.class));
        assertThat(
                service.getOperations(),
                Matchers.containsInAnyOrder(
                        "getLandingPage",
                        "getApi",
                        "getConformanceDeclaration",
                        "getStyleSet",
                        "getStyle",
                        "getStyleMetadata",
                        "updateStyleMetadata",
                        "patchStyleMetadata",
                        "addStyle",
                        "updateStyle",
                        "deleteStyle",
                        "getStyleThumbnail"));
    }

    @Test
    public void testLandingPageNoSlash() throws Exception {
        DocumentContext json = getAsJSONPath("ogc/styles", 200);
        checkJSONLandingPage(json);
    }

    @Test
    public void testLandingPageSlash() throws Exception {
        DocumentContext json = getAsJSONPath("ogc/styles/", 200);
        checkJSONLandingPage(json);
    }

    @Test
    public void testLandingPageJSON() throws Exception {
        DocumentContext json = getAsJSONPath("ogc/styles?f=json", 200);
        checkJSONLandingPage(json);
    }

    @Test
    public void testLandingPageWorkspaceSpecific() throws Exception {
        DocumentContext json = getAsJSONPath("ws/ogc/styles", 200);
        checkJSONLandingPage(json);
    }

    @Test
    @Ignore
    public void testLandingPageXML() throws Exception {
        Document dom = getAsDOM("ogc/styles?f=application/xml");
        print(dom);
        // TODO: add actual tests in here
    }

    @Test
    public void testLandingPageYaml() throws Exception {
        String yaml = getAsString("ogc/styles?f=application/x-yaml");
        // System.out.println(yaml);
        DocumentContext json = convertYamlToJsonPath(yaml);
        assertJSONList(
                json,
                "links[?(@.type == 'application/x-yaml' && @.href =~ /.*ogc\\/styles\\/\\?.*/)].rel",
                "self");
        assertJSONList(
                json,
                "links[?(@.type != 'application/x-yaml' && @.href =~ /.*ogc\\/styles\\/\\?.*/)].rel",
                "alternate",
                "alternate");
        checkJSONLandingPageShared(json);
    }

    @Test
    public void testLandingPageHTML() throws Exception {
        org.jsoup.nodes.Document document = getAsJSoup("ogc/styles?f=html");
        // check a couple of links
        assertEquals(
                "http://localhost:8080/geoserver/ogc/styles/styles?f=text%2Fhtml",
                document.select("#htmlStylesLink").attr("href"));
        assertEquals(
                "http://localhost:8080/geoserver/ogc/styles/api?f=text%2Fhtml",
                document.select("#htmlApiLink").attr("href"));
    }

    void checkJSONLandingPage(DocumentContext json) {
        assertEquals(12, (int) json.read("links.length()", Integer.class));
        // check landing page links
        assertJSONList(
                json,
                "links[?(@.type == 'application/json' && @.href =~ /.*ogc\\/styles\\/\\?.*/)].rel",
                "self");
        assertJSONList(
                json,
                "links[?(@.type != 'application/json' && @.href =~ /.*ogc\\/styles\\/\\?.*/)].rel",
                "alternate",
                "alternate");
        checkJSONLandingPageShared(json);
    }

    void checkJSONLandingPageShared(DocumentContext json) {
        // check API links
        assertJSONList(
                json,
                "links[?(@.href =~ /.*ogc\\/styles\\/api.*/)].rel",
                Link.REL_SERVICE_DESC,
                Link.REL_SERVICE_DESC,
                Link.REL_SERVICE_DOC);
        // check conformance links
        assertJSONList(
                json,
                "links[?(@.href =~ /.*ogc\\/styles\\/conformance.*/)].rel",
                Link.REL_CONFORMANCE,
                Link.REL_CONFORMANCE,
                Link.REL_CONFORMANCE);
        // check collection links
        assertJSONList(
                json,
                "links[?(@.href =~ /.*ogc\\/styles\\/styles.*/)].rel",
                "styles",
                "styles",
                "styles");
        // check title
        assertEquals("Styles server", json.read("title"));
        // check description
        assertEquals("", json.read("description"));
    }
}
