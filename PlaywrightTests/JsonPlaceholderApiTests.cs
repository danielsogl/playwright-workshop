using Microsoft.Playwright;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PlaywrightTests;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
}

[TestClass]
public class JsonPlaceholderApiTests : ContextTest
{
    [TestMethod]
    [TestCategory("api")]
    public async Task GetAllUsers()
    {
        var response = await Context.APIRequest.GetAsync("https://jsonplaceholder.typicode.com/users");
        var jsonText = await response.TextAsync();
        var data = JArray.Parse(jsonText);

        Assert.AreEqual(200, response.Status);
        Assert.AreEqual(10, data.Count);
    }

    [TestMethod]
    [TestCategory("api")]
    public async Task CreateTestUser()
    {
        var response = await Context.APIRequest.PostAsync("https://jsonplaceholder.typicode.com/users", new()
        {
            DataObject = new
            {
                name = "Test User",
                username = "Test User", 
                email = "test@test.com"
            }
        });

        var jsonText = await response.TextAsync();
        var userData = JObject.Parse(jsonText);

        Assert.AreEqual(201, response.Status);
        Assert.AreEqual(11, userData["id"]?.Value<int>());
    }

    [TestMethod]
    [TestCategory("api")]
    public async Task UpdateUser()
    {
        var response = await Context.APIRequest.PutAsync("https://jsonplaceholder.typicode.com/users/1", new()
        {
            DataObject = new { name = "Test User Updated" }
        });

        var jsonText = await response.TextAsync();
        var userData = JObject.Parse(jsonText);

        Assert.AreEqual(200, response.Status);
        Assert.AreEqual("Test User Updated", userData["name"]?.Value<string>());
    }

    [TestMethod]
    [TestCategory("api")]
    public async Task LoadAllNewsItems()
    {
        var response = await Context.APIRequest.GetAsync("http://localhost:3000/api/news/public");
        var jsonText = await response.TextAsync();
        var data = JObject.Parse(jsonText);
        var items = data["items"] as JArray;

        Assert.AreEqual(200, response.Status);
        Assert.IsNotNull(items);
        Assert.IsTrue(items.Count >= 0);
    }

    [TestMethod]
    [TestCategory("api")]
    public async Task ValidateUserSchema()
    {
        var response = await Context.APIRequest.GetAsync("https://jsonplaceholder.typicode.com/users/1");
        var jsonText = await response.TextAsync();
        var userData = JObject.Parse(jsonText);

        Assert.AreEqual(200, response.Status);
        Assert.IsTrue(userData["id"]?.Value<int>() > 0);
        Assert.IsNotNull(userData["name"]?.Value<string>());
    }
}