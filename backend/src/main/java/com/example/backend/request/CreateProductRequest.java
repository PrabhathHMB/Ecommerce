package com.example.backend.request;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.backend.modal.size;

public class CreateProductRequest {

	private String title;

	private String description;

	private int price;

	private int discountedPrice;

	private int discountPersent;

	private int quantity;

	private String brand;

	private String color;

	private List<String> colors = new ArrayList<>();

	public List<String> getColors() {
		return colors;
	}

	public void setColors(List<String> colors) {
		this.colors = colors;
	}

	private Set<size> size = new HashSet<>();

	private String imageUrl;
	
	private List<String> images = new ArrayList<>();

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}
	
	private String sizeChart;

	private String topLavelCategory;
	private String secondLavelCategory;
	private String thirdLavelCategory;

	public Set<size> getSize() {
		return size;
	}

	public void setSize(Set<size> size) {
		this.size = size;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public int getDiscountedPrice() {
		return discountedPrice;
	}

	public void setDiscountedPrice(int discountedPrice) {
		this.discountedPrice = discountedPrice;
	}

	public int getDiscountPersent() {
		return discountPersent;
	}

	public void setDiscountPersent(int discountPersent) {
		this.discountPersent = discountPersent;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getSizeChart() {
		return sizeChart;
	}

	public void setSizeChart(String sizeChart) {
		this.sizeChart = sizeChart;
	}

	public String getTopLavelCategory() {
		return topLavelCategory;
	}

	public void setTopLavelCategory(String topLavelCategory) {
		this.topLavelCategory = topLavelCategory;
	}

	public String getSecondLavelCategory() {
		return secondLavelCategory;
	}

	public void setSecondLavelCategory(String secondLavelCategory) {
		this.secondLavelCategory = secondLavelCategory;
	}

	public String getThirdLavelCategory() {
		return thirdLavelCategory;
	}

	public void setThirdLavelCategory(String thirdLavelCategory) {
		this.thirdLavelCategory = thirdLavelCategory;
	}

}
