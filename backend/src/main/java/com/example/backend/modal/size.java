package com.example.backend.modal;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Data
public class Size {

	private String name;
	private int quantity;

}
