package com.servicios.client.products.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import com.servicios.client.products.dto.ProductRequest;
import com.servicios.client.products.entity.Product;
import com.servicios.client.products.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository repo;

    @InjectMocks
    private ProductServiceImpl service;

    @Test
    void create_shouldSaveAndReturnResponse() {
        ProductRequest req = mock(ProductRequest.class);
        when(req.getSku()).thenReturn("SKU-1");
        when(req.getName()).thenReturn("Product 1");
        when(req.getDescription()).thenReturn("Desc 1");
        //when(req.getPrice()).thenReturn(new BigDecimal("9.99"));
        when(req.getStock()).thenReturn(10);

        Product saved = Product.builder()
                .sku("SKU-1")
                .name("Product 1")
                .description("Desc 1")
        //        .price(new BigDecimal("9.99"))
                .stock(10)
                .build();
        saved.setId(1L);

        when(repo.save(any(Product.class))).thenReturn(saved);

        var resp = service.create(req);

        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        assertEquals("SKU-1", resp.getSku());
        assertEquals("Product 1", resp.getName());
        assertEquals("Desc 1", resp.getDescription());
        //assertEquals(new BigDecimal("9.99"), resp.getPrice());
        assertEquals(10, resp.getStock());
        verify(repo).save(any(Product.class));
    }

    @Test
    void update_shouldModifyAndReturnResponse() {
        Long id = 2L;
        Product existing = Product.builder()
                .sku("SKU-2")
                .name("Old Name")
                .description("Old Desc")
//                .price(new BigDecimal("5.00"))
                .stock(1)
                .build();
        existing.setId(id);

        ProductRequest req = mock(ProductRequest.class);
        when(req.getName()).thenReturn("New Name");
        when(req.getDescription()).thenReturn("New Desc");
//        when(req.getPrice()).thenReturn(new BigDecimal("7.50"));
        when(req.getStock()).thenReturn(5);

        when(repo.findById(id)).thenReturn(Optional.of(existing));
        when(repo.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        var resp = service.update(id, req);

        assertNotNull(resp);
        assertEquals(id, resp.getId());
        assertEquals("SKU-2", resp.getSku());
        assertEquals("New Name", resp.getName());
        assertEquals("New Desc", resp.getDescription());
       // assertEquals(new BigDecimal("7.50"), resp.getPrice());
        assertEquals(5, resp.getStock());
        verify(repo).findById(id);
        verify(repo).save(existing);
    }

    @Test
    void update_whenNotFound_shouldThrow() {
        Long id = 99L;
        ProductRequest req = mock(ProductRequest.class);
        when(repo.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.update(id, req));
        verify(repo).findById(id);
        verify(repo, never()).save(any());
    }

    @Test
    void delete_shouldCallRepository() {
        Long id = 3L;
        doNothing().when(repo).deleteById(id);

        service.delete(id);

        verify(repo).deleteById(id);
    }

    @Test
    void getById_shouldReturnResponse() {
        Long id = 4L;
        Product p = Product.builder()
                .sku("SKU-4")
                .name("P4")
                .description("D4")
//                .price(new BigDecimal("1.00"))
                .stock(2)
                .build();
        p.setId(id);

        when(repo.findById(id)).thenReturn(Optional.of(p));

        var resp = service.getById(id);

        assertNotNull(resp);
        assertEquals(id, resp.getId());
        assertEquals("SKU-4", resp.getSku());
        assertEquals("P4", resp.getName());
    }

    @Test
    void getById_whenNotFound_shouldThrow() {
        Long id = 5L;
        when(repo.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getById(id));
    }

    @Test
    void getAll_shouldReturnListOfResponses() {
        Product p1 = Product.builder()
                .sku("A")
                .name("A1")
                .description("d1")
//                .price(new BigDecimal("1"))
                .stock(1)
                .build();
        p1.setId(10L);
        Product p2 = Product.builder()
                .sku("B")
                .name("B1")
                .description("d2")
//                .price(new BigDecimal("2"))
                .stock(2)
                .build();
        p2.setId(11L);

        List<Product> list = Arrays.asList(p1, p2);
        when(repo.findAll()).thenReturn(list);

        var respList = service.getAll();

        assertNotNull(respList);
        assertEquals(2, respList.size());
        assertEquals(10L, respList.get(0).getId());
        assertEquals(11L, respList.get(1).getId());
        verify(repo).findAll();
    }
}