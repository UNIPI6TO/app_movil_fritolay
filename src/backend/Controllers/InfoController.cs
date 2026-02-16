using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("status/[controller]")]
    public class infoController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public infoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var appSection = _configuration.GetSection("Application");

            var result = new
            {
                Name = appSection["Name"],
                Version = appSection["Version"]
            };

            return new JsonResult(result);
        }

    }

}
