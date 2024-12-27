import React, { useRef, useEffect, useState, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import AddModal, { type Ref } from "../../layout/add-modal";

type Props = {
  onClose: () => void;
//   onSave: (signature: string) => void; // Callback to save the signature as a base64 string
};

export default forwardRef<Ref, Props>(({ onClose/*, onSave*/ }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctx.strokeStyle = "green"; // color
    ctx.lineWidth = 2; // thickness
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signature = canvas.toDataURL("image/png");
    // onSave(signature); // Pass the signature as a base64 string
    onClose();
  };

  return (
    <AddModal ref={ref} title="Add Signature" action={null}>
      <Container>
        <canvas
          ref={canvasRef}
          width={440}
          height={200}
          style={{
            border: "1px solid #ccc",
            display: "block",
            marginBottom: "10px",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <Container as="div" style={{ display: "flex", gap: 10 }}>
          <Button variant="danger" onClick={clearCanvas}>
            Clear
          </Button>
          <Button variant="success" onClick={saveSignature}>
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Container>
      </Container>
    </AddModal>
  );
});
