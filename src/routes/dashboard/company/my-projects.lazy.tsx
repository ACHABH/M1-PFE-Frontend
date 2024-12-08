import { useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/company/my-projects")({
  component: Component,
});

interface Topic {
  id: number;
  title: string;
  description: string;
  specialty: string;
  technologies: string;
  status: "Accepted" | "Pending";
}

// Sample Topics
interface Topic {
  id: number;
  title: string;
  description: string;
  specialty: string;
  technologies: string;
  status: "Accepted" | "Pending";
}

// Sample Topics
const Topics: Topic[] = [
  {
    id: 1,
    title: "AI-Powered Health Diagnosis",
    description:
      "Using artificial intelligence to aid in early diagnosis of diseases.",
    specialty: "Healthcare",
    technologies: "Machine Learning, Python, TensorFlow",
    status: "Pending",
  },
  {
    id: 2,
    title: "Blockchain for Secure Transactions",
    description: "Implementing blockchain to enhance transaction security.",
    specialty: "Finance",
    technologies: "Blockchain, Ethereum",
    status: "Accepted",
  },
  {
    id: 3,
    title: "IoT for Smart Cities",
    description: "Developing IoT solutions for urban infrastructure.",
    specialty: "Infrastructure",
    technologies: "IoT, Sensors, Cloud Computing",
    status: "Pending",
  },
  {
    id: 4,
    title: "Cybersecurity Threat Intelligence",
    description: "Building systems to detect and prevent cyber threats.",
    specialty: "Cybersecurity",
    technologies: "Python, Machine Learning, Data Analysis",
    status: "Accepted",
  },
  {
    id: 5,
    title: "Renewable Energy Integration",
    description:
      "Developing solutions for integrating renewable energy sources into the grid.",
    specialty: "Energy",
    technologies: "Power Electronics, Control Systems, Simulation",
    status: "Pending",
  },
  {
    id: 6,
    title: "Natural Language Processing for Chatbots",
    description:
      "Creating intelligent chatbots for customer service and support.",
    specialty: "AI",
    technologies: "NLP, Python, Deep Learning",
    status: "Accepted",
  },
  {
    id: 7,
    title: "Augmented Reality in Retail",
    description:
      "Developing AR applications for enhanced shopping experiences.",
    specialty: "Retail",
    technologies: "AR/VR, Computer Vision, Mobile Development",
    status: "Pending",
  },
  {
    id: 8,
    title: "Big Data Analytics for Business Intelligence",
    description:
      "Analyzing large datasets to gain valuable insights for businesses.",
    specialty: "Business",
    technologies: "Big Data, Data Mining, Cloud Computing",
    status: "Accepted",
  },
  {
    id: 9,
    title: "Space Exploration Technologies",
    description: "Developing technologies for future space missions.",
    specialty: "Aerospace",
    technologies: "Robotics, AI, Aerospace Engineering",
    status: "Pending",
  },
  {
    id: 10,
    title: "Sustainable Agriculture Solutions",
    description:
      "Developing technologies for sustainable and efficient farming practices.",
    specialty: "Agriculture",
    technologies: "IoT, AI, Precision Agriculture",
    status: "Accepted",
  },
];

function Component() {
  const [topics, setTopics] = useState<Topic[]>(Topics);

  // Function to delete a topic
  const handleDelete = (topicId: number) => {
    setTopics((prevTopics) =>
      prevTopics.filter((topic) => topic.id !== topicId)
    );
  };

  // Function to edit a topic (placeholder logic)
  const handleEdit = (topicId: number) => {
    alert(
      `Edit functionality for topic ID: ${topicId} is not implemented yet.`
    );
  };

  return (
    <div>
      {/* Header with Title and "Propose New Topic" Button */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2>Your Topics</h2>
        <Button variant="primary" size="lg">
          Propose New Topic
        </Button>
      </div>

      {/* List of Topics */}
      <div className="d-flex flex-column gap-5">
        {topics.map((topic) => (
          <Card key={topic.id} className="w-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                {/* Topic Title, Description, and Status Badge */}
                <div>
                  <Card.Title>{topic.title}</Card.Title>
                  <Card.Text>{topic.description}</Card.Text>
                  <Badge
                    bg={topic.status === "Accepted" ? "success" : "warning"}
                    className="mb-2"
                  >
                    {topic.status}
                  </Badge>
                  <p className="mb-1">
                    <strong>Specialty:</strong> {topic.specialty}
                  </p>
                  <p>
                    <strong>Technologies:</strong> {topic.technologies}
                  </p>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="d-flex align-items-start">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 d-flex align-items-center"
                    onClick={() => handleEdit(topic.id)}
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={() => handleDelete(topic.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
