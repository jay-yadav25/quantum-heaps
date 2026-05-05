@zilo
Feature: Shopping Cart and Checkout Flow
  As a logged-in user on Zilo
  I want to add products from multiple categories and checkout in one go

  Background:
    Given User navigates to the Zilo homepage

  Scenario: Add products from all categories and checkout once
    When User opens the Womens shop
    And User selects the Womens product
    And User selects size for "women"
    And User adds the item to the bag

    When User navigates to the Men category
    And User opens the Mens shop
    And User selects the Mens product
    And User selects size for "men"
    And User adds the item to the bag "men" times

    When User navigates to the Kids category
    And User opens the Kids shop
    And User selects the Kids product
    And User selects size for "kids"
    And User adds the item to the bag

    When User goes to the bag
    And User applies any available coupon
    And User selects the delivery address
    And User removes all applied coupons
    Then User completes checkout and order is placed
