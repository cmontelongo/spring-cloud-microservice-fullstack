package com.servicios.client.products.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
	private String sku;
	private String name;
	private String description;
	private Double price;
	private Integer stock;
}
