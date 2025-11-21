package com.servicios.client.products.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.servicios.client.products.dto.ProductRequest;
import com.servicios.client.products.dto.ProductResponse;
import com.servicios.client.products.repository.ProductRepository;
import com.servicios.client.products.service.ProductService;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService service;

    @Mock
    private ProductRepository repo;

    @InjectMocks
    private ProductController controller;

    @Test
    void all_returnsListFromService() {
        ProductResponse p = mock(ProductResponse.class);
        List<ProductResponse> expected = List.of(p);
        when(service.getAll()).thenReturn(expected);

        ResponseEntity<List<ProductResponse>> resp = controller.all();

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertEquals(expected, resp.getBody());
    }

    @Test
    void get_returnsProductFromService() {
        long id = 1L;
        ProductResponse p = mock(ProductResponse.class);
        when(service.getById(id)).thenReturn(p);

        ResponseEntity<ProductResponse> resp = controller.get(id);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertSame(p, resp.getBody());
    }

    @Test
    void create_callsServiceAndReturnsCreatedProduct() {
        ProductRequest req = mock(ProductRequest.class);
        ProductResponse created = mock(ProductResponse.class);
        when(service.create(req)).thenReturn(created);

        ResponseEntity<ProductResponse> resp = controller.create(req, "some-user");

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertSame(created, resp.getBody());
        verify(service).create(req);
    }

    @Test
    void update_callsServiceAndReturnsUpdatedProduct() {
        long id = 2L;
        ProductRequest req = mock(ProductRequest.class);
        ProductResponse updated = mock(ProductResponse.class);
        when(service.update(id, req)).thenReturn(updated);

        ResponseEntity<ProductResponse> resp = controller.update(id, req);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertSame(updated, resp.getBody());
    }

    @Test
    void delete_callsServiceAndReturnsNoContent() {
        long id = 3L;
        doNothing().when(service).delete(id);

        ResponseEntity<Void> resp = controller.delete(id);

        assertEquals(HttpStatus.NO_CONTENT, resp.getStatusCode());
        verify(service).delete(id);
    }
}