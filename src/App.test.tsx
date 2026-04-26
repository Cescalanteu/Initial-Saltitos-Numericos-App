import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

async function openManualProblem(a = "3", b = "2") {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /empezar/i }));
  await user.selectOptions(screen.getByLabelText(/primer sumando/i), a);
  await user.selectOptions(screen.getByLabelText(/segundo sumando/i), b);
  await user.click(screen.getByRole("button", { name: /usar suma manual/i }));
  return user;
}

describe("Saltitos Numéricos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("el flujo 3 + 2 permite seleccionar 3, luego 4, luego 5, y muestra 3 + 2 = 5", async () => {
    const user = await openManualProblem("3", "2");

    expect(screen.getByText(/Busca el 3/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Número 3/i }));
    expect(screen.getByText(/Da 2 saltitos/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Número 4/i }));
    expect(screen.getAllByText(/Faltan 1/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /^Número 5/i }));
    expect(screen.getAllByText("3 + 2 = 5").length).toBeGreaterThan(0);
  });

  it("si toca 6 al inicio de 3 + 2, no castiga y ofrece ayuda visual", async () => {
    const user = await openManualProblem("3", "2");

    await user.click(screen.getByRole("button", { name: /^Número 6/i }));

    expect(screen.queryByText(/incorrecto|mal|fallaste/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Busca este número/i)).toBeInTheDocument();
    expect(screen.getByText(/Número señalado: 3/i)).toBeInTheDocument();
  });

  it("si durante el salto desde 3 toca 5 directamente, indica un saltito y resalta 4", async () => {
    const user = await openManualProblem("3", "2");

    await user.click(screen.getByRole("button", { name: /^Número 3/i }));
    await user.click(screen.getByRole("button", { name: /^Número 5/i }));

    expect(screen.getByText(/Un saltito a la derecha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Número 4, siguiente salto/i })).toHaveAttribute("data-hint", "true");
  });

  it("el botón Pausa cambia a PAUSE y luego permite volver sin perder progreso", async () => {
    const user = await openManualProblem("3", "2");
    await user.click(screen.getByRole("button", { name: /^Número 3/i }));
    await user.click(screen.getByRole("button", { name: /^Pausa$/i }));

    expect(screen.getByRole("heading", { name: /Pausa tranquila/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /volver a la actividad/i }));
    expect(screen.getByText(/Da 2 saltitos/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Número 4, siguiente salto/i })).toBeInTheDocument();
  });

  it("el setting reducedMotion elimina o simplifica animaciones", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /empezar/i }));
    await user.click(screen.getByLabelText(/Reducir movimiento/i));

    expect(screen.getByRole("main")).toHaveAttribute("data-motion", "reduced");
  });

  it("los botones principales tienen nombre accesible", async () => {
    await openManualProblem("3", "2");

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button).toHaveAccessibleName();
    }
  });

  it("la recta numérica es navegable por teclado", async () => {
    const user = await openManualProblem("3", "2");
    const numberLine = screen.getByRole("group", { name: /Recta numérica/i });
    const numberThree = within(numberLine).getByRole("button", { name: /^Número 3/i });

    numberThree.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByText(/Da 2 saltitos/i)).toBeInTheDocument();
  });
});
