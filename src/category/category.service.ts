/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto'; // Đảm bảo bạn đã tạo DTO cho Category
import { UpdateCategoryDto } from './dto/update-category.dto'; // Đảm bảo bạn đã tạo DTO cho Category
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity'; // Đảm bảo bạn đã định nghĩa entity Category
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  //check category name exist
  async checkCategoryNameExist(categoryName: string) {
    const category = await this.categoryRepository.findOne({
      where: { categoryName },
    });
    if (category) return true;
    else return false;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const isCategoryNameExist = await this.checkCategoryNameExist(createCategoryDto.categoryName);
    const isContainSpecialCharacterCategoryName = await this.containsSpecialCharacter(createCategoryDto.categoryName);

    if(isContainSpecialCharacterCategoryName) {
      throw new NotAcceptableException(`Category name must not contain special characters`);
    }
    if (isCategoryNameExist) {
      throw new NotFoundException(`Category with name ${createCategoryDto.categoryName} already exists`);
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({ where: { id } });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return existingCategory;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({ where: { id } });
    const isContainSpecialCharacterCategoryName = await this.containsSpecialCharacter(updateCategoryDto.categoryName);

    if(isContainSpecialCharacterCategoryName) {
      throw new NotAcceptableException(`Category name must not contain special characters`);
    }

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(existingCategory, updateCategoryDto);

    return await this.categoryRepository.save(existingCategory);
  }

  async remove(id: number): Promise<void> {
    const categoryToRemove = await this.categoryRepository.findOne({ where: { id } });

    if (!categoryToRemove) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.remove(categoryToRemove);
  }

  async containsSpecialCharacter(str: string): Promise<boolean> {
    // Create a regular expression to check the string
    const regex = /^[a-zA-Z\s]+$/;
  
    // Use the test() method to check the string
    return !regex.test(str);
  }
}
