<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize inputs
    $full_name = filter_var($_POST['full_name'], FILTER_SANITIZE_STRING);
    $company   = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
    $email     = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $service   = filter_var($_POST['service'], FILTER_SANITIZE_STRING);

    // Basic validation
    if (empty($full_name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please provide a valid name and email address.']);
        exit;
    }

    $recipient = "info@eclipsesecuritygroup.com";
    $subject = "New Security Assessment Request: $service";

    // Build email content
    $email_content = "You have received a new security assessment request from your website.\n\n";
    $email_content .= "Full Name: $full_name\n";
    $email_content .= "Company: $company\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Enquiry Type: $service\n";

    // Build email headers
    $headers = "From: Eclipse Website <noreply@eclipsesecuritygroup.com>\r\n";
    $headers .= "Reply-To: $full_name <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send the email
    if (mail($recipient, $subject, $email_content, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Thank you! Your assessment request has been sent.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Oops! Something went wrong, and we couldn\'t send your message.']);
    }
} else {
    // Not a POST request
    echo json_encode(['success' => false, 'message' => 'There was a problem with your submission, please try again.']);
}
?>
