<?php

// Database connection details
$host = "localhost";
$username = "kiritosate";
$password = "iamkiritosate";
$database = "keychaindb";

// Create database connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form

if ($_SERVER["REQUEST_METHOD"] == "POST") {

//Get form data
$musicTitle = $_POST["music_title"];
$name = $_POST["name"];
$message = $_POST["message"];

// File upload handling
$targetDirectory = "uploads/";

// Array to store uploaded file paths
$imagePaths = array();

for ($i = 1; $i <= 4; $i++) {
    $fileInputName = "image" . $i;
    $targetFile = $targetDirectory . basename($_FILES[$fileInputName]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if file already exists
    if (file_exists($targetFile)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }

    // Check file size
    if ($_FILES[$fileInputName]["size"] > 500000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    // Allow certain file formats
    $allowedExtensions = array("jpg", "jpeg", "png", "gif");
    if (!in_array($imageFileType, $allowedExtensions)) {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        // If everything is ok, try to upload file
        if (move_uploaded_file($_FILES[$fileInputName]["tmp_name"], $targetFile)) {
            // Add the uploaded file path to the array
            $imagePaths[] = $targetFile;
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

// Insert data into database
$sql = "INSERT INTO uploads (music_title, name, message, image1, image2, image3, image4) VALUES ('$musicTitle', '$name', '$message', '$imagePaths[0]', '$imagePaths[1]', '$imagePaths[2]', '$imagePaths[3]')";

if ($conn->query($sql) === TRUE) {
    echo "Record added successfully.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

}

// Close database connection
$conn->close();

?>