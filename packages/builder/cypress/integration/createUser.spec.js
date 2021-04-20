context("Create a User", () => {
  before(() => {
    cy.login()
    cy.createTestApp()
  })

  it("should create a user", () => {
    cy.createUser("bbuser@test.com", "test", "ADMIN")
    cy.contains("bbuser").should("be.visible")
  })
})
