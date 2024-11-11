# PixelPhraser - CommerceTools Connector 
The PixelPhraser - CommerceTools Connector automates product description creation using Google Cloud Vision AI and Generative AI, which interpret product images to create detailed, relevant descriptions. It also features a Custom Application for review, allowing efficient management of these AI-generated descriptions within the CommerceTools platform.

<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="https://unpkg.com/@commercetools-frontend/assets/logos/commercetools_primary-logo_horizontal_RGB.png">
  </a>
  <br/>
  <a href="https://pixelphraser-ct-connector.s3.us-east-1.amazonaws.com/PixelPhraser.jpeg">
    <img alt="pixel-phraser-logo" src="https://pixelphraser-ct-connector.s3.us-east-1.amazonaws.com/PixelPhraser.jpeg">
  </a>
</p>

---

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Functional Overview](#functional-overview)
4. [Application Workflow](#application-workflow)
5. [Key Components](#key-components)
6. [Prerequisites and Setup](#prerequisites-and-setup)
7. [Running the Application Locally](#running-the-application-locally)
8. [Uninstalling the Connector](#uninstalling-the-connector)
9. [References](#references)

---

## <a id="introduction"></a> 1. Introduction
The PixelPhraser - CommerceTools Connector automates product description creation, leveraging Google Cloud Vision AI and Generative AI to analyze product images and generate detailed, engaging descriptions. This solution interprets images to identify objects, colors, and sentiments, transforming this data into informative and SEO-friendly descriptions. A custom application within the CommerceTools platform allows customers to review and approve or reject these AI-generated descriptions, ensuring quality and consistency. This streamlines the description creation process, enhancing efficiency and improving the accuracy and engagement of product content, ultimately driving sales and boosting customer satisfaction.

## <a id="features"></a> 2. Features
- **Automated Event-Driven Processing**
- **Advanced Image Analysis with Vision AI**
- **Generative AI-Powered Product Description Generation**
- **Temporary Storage Management**
- **Custom Application for Review**

## <a id="functional-overview"></a> 3. Functional Overview
This connector is designed to automate the generation of product descriptions based on product creation events. Below is a step-by-step breakdown of its functionality:
1. **Receiving Event Triggers:**
   - The connector listens for product creation events to initiate the description generation process.
2. **Checking Attribute:**
   - It checks if the `generateDescription` attribute is set to `true`. 
   - If `true`, the connector proceeds with the description generation; if `false`, the process is skipped.
3. **Analyzing Product Images:**
   - The connector interprets product images using Vision AI.
   - It captures various attributes such as labels, colors, text, objects, and web entities from the images.
4. **Generating Descriptions:**
   - High-quality, detailed descriptions are generated based on the analyzed image data using Google Generative AI.
5. **Updating Custom Objects:**
   - The generated descriptions are stored temporarily in CommerceTools Custom Objects for customer review.
6. **User  Interface for Review:**
   - Customers can search for descriptions, view associated images, and accept or reject the generated descriptions through a user-friendly interface.

## <a id="application-workflow"></a> 4. Application Workflow
### Workflow Overview
![Workflow Diagram](https://pixelphraser-ct-connector.s3.us-east-1.amazonaws.com/pixelphraser-flowdiagram.jpeg)
![Activity Diagram](https://pixelphraser-ct-connector.s3.us-east-1.amazonaws.com/pixelphraser-activitydiagram.jpeg)

## <a id="key-components"></a> 5. Key Components
### Event Listener
- **Functionality:** Listens for product publication events in CommerceTools. Receives the event payload, parses product details, and checks if the "generateDescription" flag is true. If the attribute is present and true, it triggers description generation; otherwise, it skips the process.
### Image Analysis with Vision AI
- **Module:** `productAnalysis`
- **Functionality:** Analyzes product image URLs, extracting key visual elements such as labels, objects, colors, text, and web entities.
- **Outputs:** Structured image data providing foundational information for description generation. 
### Description Generation with Generative AI
- **Module:** `generateProductDescription`
- **Functionality:** Generates product descriptions based on the structured image data. Ensures descriptions are relevant and engaging for e-commerce use.
- **Outputs:** Fully generated product description ready for integration in CommerceTools.
### Temporary Storage in CommerceTools
- **Creation:** Initializes a custom object with placeholder metadata and description data.
- **Update:** Finalizes the object by adding generated description and relevant metadata, preparing it for customer review.
### User  Interface for Review
- **Functionality:** Allows customers to review and approve or reject these AI-generated descriptions.

## <a id="prerequisites-and-setup"></a> 6. Prerequisites and Setup
### 6.1 CommerceTools Account and API Keys
1. Navigate to **Settings > Developer settings > Create new API client**.
2. Capture the following details:
   - `CTP_PROJECT_KEY`
   - `CTP_CLIENT_SECRET`
   - `CTP_CLIENT_ID`
   - `CTP_AUTH_URL`
   - `CTP_API_URL`
   - `CTP_SCOPE`
   - `CTP_REGION`

### 6.2 Google Cloud Platform (GCP) Setup
1. Create a project in GCP and enable Vision API and Generative AI.
2. Required credentials:
   - **Base64-encoded Service Account:** `BASE64_ENCODED_GCP_SERVICE_ACCOUNT`
   - **Generative AI API Key and Model:** `GENERATIVE_AI_API_KEY`, `GEMINI_MODEL`

### 6.3 Environment Configuration
Configure your `.env` file with the following details:
```plaintext
# CommerceTools Credentials
CTP_PROJECT_KEY=your_project_key
CTP_CLIENT_SECRET=your_client_secret
CTP_CLIENT_ID=your_client_id
CTP_AUTH_URL=https://auth.commercetools.com/oauth/token
CTP_API_URL=https://api.commercetools.com
CTP_SCOPE=manage_project
CTP_REGION=us-central1
# Google Cloud Platform Credentials
BASE64_ENCODED_GCP_SERVICE_ACCOUNT=your_base64_encoded_service_account
GEMINI_MODEL=your_gemini_model
GENERATIVE_AI_API_KEY=your_api_key
```

## <a id="running-the-application-locally"></a> 7. Running the Application Locally
To set up and run PixelPhraser on your local machine:
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/amal-thomson/pixelphraser.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd pixelphraser/event-pixelphraser #for event application
   or
   cd pixelphraser/mc-pixelphraser #for custom application
   ```
3. **Install Dependencies:**
   ```bash
   yarn install
   ```
4. **Configure Environment Variables:** Ensure the `.env` file is updated as described above.
5. **Start the Application in Development Mode:**
   ```bash
   yarn start:dev #for event application
   or
   yarn start #for custom application
   ```
This command initializes the application, enabling it to listen for product events and process them according to the setup flow.

## <a id="uninstalling-the-connector"></a> 8. Uninstalling the Connector
To uninstall the PixelPhraser Connector from your CommerceTools project:
### Method 1: Using the CommerceTools API
- Send a DELETE request to the Custom Object's API endpoint. Refer to the [API Documentation for DELETE Requests](https://docs.commercetools.com/api/projects/subscriptions#delete-subscription).
### Method 2: Through Merchant Center
- Navigate to **Settings > Developer settings** and remove the API client associated with PixelPhraser.

## <a id="references"></a> 9. References
- [CommerceTools Documentation](https://docs.commercetools.com/)
- [Google Cloud Documentation](https://cloud.google.com/docs)

---

This documentation provides a structured guide for setting up, operating, and uninstalling the PixelPhraser Connector for efficient product description automation in CommerceTools.
