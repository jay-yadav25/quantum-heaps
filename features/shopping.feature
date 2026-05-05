@zilo
Feature: Shopping Cart and Checkout Flow
  As a logged-in user on Zilo
  I want to browse products across categories, add items to cart, and place an order

  Background:
    Given User navigates to the Zilo homepage

  Scenario: Add Womens product to bag and checkout
    When User opens the Womens shop
    And User selects the Womens product
    And User selects size for "women"
    And User adds the item to the bag
    And User goes to the bag
    And User applies any available coupon
    And User selects the delivery address
    And User removes all applied coupons
    And User opens the payment options
    And User selects Pay on Delivery
    And User confirms the order
    Then the order should be placed successfully for "women"

  Scenario: Add Mens product to bag and checkout
    When User navigates to the Men category
    And User opens the Mens shop
    And User selects the Mens product
    And User adds the item to the bag "men" times
    And User goes to the bag
    And User opens the payment options
    And User selects Pay on Delivery
    And User confirms the order
    Then the order should be placed successfully for "men"

  Scenario: Add Kids product to bag and checkout
    When User navigates to the Kids category
    And User opens the Kids shop
    And User opens the SUTA WOMEN sub category
    And User selects the Kids product
    And User selects size for "kids"
    And User adds the item to the bag
    And User goes to the bag
    And User opens the payment options
    And User selects Pay on Delivery
    And User confirms the order
    Then the order should be placed successfully for "kids"
