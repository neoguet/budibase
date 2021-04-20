context("Create a automation", () => {
  before(() => {
    cy.login()
    cy.createTestApp()
  })

  // https://on.cypress.io/interacting-with-elements
  it("should create a automation", () => {
    cy.createTestTableWithData()

    cy.contains("automate").click()
    cy.get("[data-cy=new-automation]").click()
    cy.get(".modal").within(() => {
      cy.get("input").type("Add Row")
      cy.get(".buttons")
        .contains("Create")
        .click()
    })

    // Add trigger
    cy.contains("Trigger").click()
    cy.contains("Row Created").click()
    cy.get(".setup").within(() => {
      cy.get("select")
        .first()
        .select("dog")
    })

    // Create action
    cy.contains("Action").click()
    cy.contains("Create Row").click()
    cy.get(".setup").within(() => {
      cy.get("select")
        .first()
        .select("dog")
      cy.get("input")
        .first()
        .type("goodboy")
      cy.get("input")
        .eq(1)
        .type("11")
    })

    // Save
    cy.contains("Save Automation").click()

    // Activate Automation
    cy.get("[data-cy=activate-automation]").click()
    cy.get(".ri-stop-circle-fill.highlighted").should("be.visible")
  })

  it("should add row when a new row is added", () => {
    cy.contains("data").click()
    cy.addRow(["Rover", 15])
    cy.reload()
    cy.contains("goodboy").should("have.text", "goodboy")
  })
})
