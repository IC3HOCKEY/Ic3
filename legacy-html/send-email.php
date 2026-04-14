<?php
header('Content-Type: application/json');

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

// Recipient email
$to = 'ic3.kontakt@outlook.com';

// Email subject
$subject = 'Fråga från IC3 webbplats';

// Email body
$body = "Namn: $name\n\n";
$body .= "E-post: $email\n\n";
$body .= "Meddelande:\n$message";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'E-posten har skickats!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Fel vid skickandet av e-post.']);
}
?>
