package main

import (
	"context"
	"fmt"
	"mime/multipart"

	"log"

	"time"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Feedback struct {
	Name        string    `bson:"name"`
	USN         string    `bson:"usn"`
	Branch      string    `bson:"branch"`
	ImageURL    string    `bson:"image_url"`
	SubmittedAt time.Time `bson:"submitted_at"`
}

var feedbackCollection *mongo.Collection

func main() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		log.Fatal(err)
	}

	feedbackCollection = client.Database("touristDB").Collection("feedbacks")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type,Accept",
	}))

	app.Post("/submit", handlerFeedback)

	app.Listen(":8080")
}

func handlerFeedback(c *fiber.Ctx) error {
	name := c.FormValue("name")
	usn := c.FormValue("usn")
	branch := c.FormValue("branch")
	fileHeader, err := c.FormFile("screenshot")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Screenshot required"})
	}

	// // Open the file
	// file, err := fileHeader.Open()
	// if err != nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open file"})
	// }
	// defer file.Close()

	// // Read bytes
	// fileBytes, err := io.ReadAll(file)
	// if err != nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read file"})
	// }

	// // Convert to Base64
	// imageBase64 := base64.StdEncoding.EncodeToString(fileBytes)

	file, err := fileHeader.Open()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open file"})
	}

	defer file.Close()

	imageURL, err := uploadToCloudinary(file)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cloudinary upload failed"})
	}

	entry := Feedback{
		Name:        name,
		USN:         usn,
		ImageURL:    imageURL,
		Branch:      branch,
		SubmittedAt: time.Now(),
	}

	_, err = feedbackCollection.InsertOne(context.Background(), entry)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save feedback"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":   "Feedback submitted sucessfully",
		"image_url": imageURL,
	})
}

func uploadToCloudinary(file multipart.File) (string, error) {
	cld, err := cloudinary.NewFromParams(
		"dlyr7izze",
		"956123596694463",
		"jBs9sZO-hSQi04qCKfXzGI83URk",
	)

	// fmt.Println(cld)
	if err != nil {
		return " ", fmt.Errorf("Cloudinary config error :%v", err)
	}

	uploadResult, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{})

	if err != nil {
		return " ", fmt.Errorf("Upload failed: %v", err)
	}

	fmt.Println(uploadResult)
	return uploadResult.SecureURL, nil
}
