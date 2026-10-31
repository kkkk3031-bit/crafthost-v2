package com.khaled.crafthost;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;

public class NormalizeTest {
    @Test public void bareHostGetsHttps() {
        assertEquals("https://abc.trycloudflare.com", MainActivity.normalize("abc.trycloudflare.com"));
    }
    @Test public void pathAndSlashStripped() {
        assertEquals("https://abc.trycloudflare.com", MainActivity.normalize(" https://ABC.trycloudflare.com/dashboard.html?x=1 "));
    }
    @Test public void portKept() {
        assertEquals("https://example.com:8443", MainActivity.normalize("https://example.com:8443/"));
    }
    @Test public void plainHttpOnlyForLocalDev() {
        assertNull(MainActivity.normalize("http://example.com"));
        assertEquals("http://10.0.2.2:4000", MainActivity.normalize("http://10.0.2.2:4000/login.html"));
    }
    @Test public void junkRejected() {
        assertNull(MainActivity.normalize(""));
        assertNull(MainActivity.normalize("   "));
        assertNull(MainActivity.normalize("not a url"));
        assertNull(MainActivity.normalize("javascript:alert(1)"));
        assertNull(MainActivity.normalize("ftp://example.com"));
        assertNull(MainActivity.normalize(null));
    }
    @Test public void webViewMajorParsed() {
        assertEquals(66, MainActivity.parseMajor("66.0.3359.158"));
        assertEquals(131, MainActivity.parseMajor(" 131.0.6778.39 "));
        assertEquals(-1, MainActivity.parseMajor("dev"));
        assertEquals(-1, MainActivity.parseMajor(null));
    }
}
